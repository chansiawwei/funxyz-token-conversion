import { useQuery } from '@tanstack/react-query';
import { getAssetPriceInfo } from '@funkit/api-base';
import type { Token, TokenPrice, SwapCalculation } from '../types';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

/**
 * Improved hook for swap calculation with better error handling and logic
 */
export const useImprovedSwapCalculation = (
  sourceToken: Token | null,
  targetToken: Token | null,
  usdAmount: number
) => {
  const isEnabled = 
    !!sourceToken &&
    !!targetToken &&
    usdAmount > 0 &&
    !isNaN(usdAmount) &&
    isFinite(usdAmount);

  return useQuery({
    queryKey: ['improvedSwapCalculation', sourceToken?.address, sourceToken?.chainId, targetToken?.address, targetToken?.chainId, usdAmount],
    queryFn: async (): Promise<SwapCalculation> => {
      if (!sourceToken || !targetToken) {
        throw new Error('Missing required tokens for swap calculation');
      }

      if (usdAmount <= 0 || !isFinite(usdAmount)) {
        throw new Error('Invalid USD amount');
      }

      // Get token addresses, using placeholder for native tokens
      const sourceAddress = sourceToken.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const targetAddress = targetToken.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

      // Fetch prices in parallel
      const [sourcePriceResponse, targetPriceResponse] = await Promise.all([
        getAssetPriceInfo({
          apiKey: API_KEY,
          chainId: sourceToken.chainId,
          assetTokenAddress: sourceAddress,
        }),
        getAssetPriceInfo({
          apiKey: API_KEY,
          chainId: targetToken.chainId,
          assetTokenAddress: targetAddress,
        })
      ]);

      // Validate price responses
      if (!sourcePriceResponse || typeof sourcePriceResponse.unitPrice !== 'number') {
        throw new Error(`Failed to fetch price for ${sourceToken.symbol}`);
      }

      if (!targetPriceResponse || typeof targetPriceResponse.unitPrice !== 'number') {
        throw new Error(`Failed to fetch price for ${targetToken.symbol}`);
      }

      const sourcePrice = sourcePriceResponse.unitPrice;
      const targetPrice = targetPriceResponse.unitPrice;

      // Validate prices are positive numbers
      if (sourcePrice <= 0 || !isFinite(sourcePrice)) {
        throw new Error(`Invalid price for ${sourceToken.symbol}: ${sourcePrice}`);
      }

      if (targetPrice <= 0 || !isFinite(targetPrice)) {
        throw new Error(`Invalid price for ${targetToken.symbol}: ${targetPrice}`);
      }

      // Calculate token amounts based on USD value
      // Formula: tokenAmount = usdAmount / tokenPrice
      const sourceAmount = usdAmount / sourcePrice;
      const targetAmount = usdAmount / targetPrice;

      // Validate calculated amounts
      if (!isFinite(sourceAmount) || !isFinite(targetAmount)) {
        throw new Error('Calculation resulted in invalid amounts');
      }

      // Apply proper decimal precision based on token decimals or default to 6
      const sourceDecimals = sourceToken.decimals || 6;
      const targetDecimals = targetToken.decimals || 6;
      
      // Use Math.round for better precision than toFixed
      const roundedSourceAmount = Math.round(sourceAmount * Math.pow(10, sourceDecimals)) / Math.pow(10, sourceDecimals);
      const roundedTargetAmount = Math.round(targetAmount * Math.pow(10, targetDecimals)) / Math.pow(10, targetDecimals);

      return {
        sourceAmount: roundedSourceAmount,
        targetAmount: roundedTargetAmount,
        sourceToken,
        targetToken,
        usdAmount,
      };
    },
    enabled: isEnabled,
    staleTime: 15 * 1000, // Swap calculations should be relatively fresh (15 seconds)
    gcTime: 60 * 1000, // Keep in cache for 1 minute
    retry: (failureCount, error) => {
      // Don't retry on validation errors
      if (error.message.includes('Invalid') || error.message.includes('Missing')) {
        return false;
      }
      // Retry up to 2 times for network errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

/**
 * Helper function to format numbers with appropriate precision
 */
export const formatTokenAmount = (amount: number, decimals: number = 6): string => {
  if (amount === 0) return '0';
  if (amount < Math.pow(10, -decimals)) return `< ${Math.pow(10, -decimals)}`;
  
  // Use significant digits for very small numbers
  if (amount < 0.01) {
    return amount.toPrecision(3);
  }
  
  // Use fixed decimals for larger numbers, removing trailing zeros
  return amount.toFixed(Math.min(decimals, 6)).replace(/\.?0+$/, '');
};