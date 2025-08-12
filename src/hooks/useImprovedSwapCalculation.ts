import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getAssetPriceInfo } from '@funkit/api-base';
import type { Token } from '../types';
import { API_KEY } from '../constants';

/**
 * Simplified hook for swap calculation with optimized caching and auto-refresh
 */
export const useImprovedSwapCalculation = (
  sourceToken: Token | null,
  targetToken: Token | null,
  usdAmount: number
) => {
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(60);
  const isEnabled = !!sourceToken && !!targetToken;

  // Auto-refresh countdown timer
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Invalidate and refetch when countdown reaches 0
          queryClient.invalidateQueries({
            queryKey: ['swapCalculation', sourceToken?.address, sourceToken?.chainId, targetToken?.address, targetToken?.chainId, usdAmount]
          });
          return 60; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEnabled, sourceToken?.address, sourceToken?.chainId, targetToken?.address, targetToken?.chainId, usdAmount, queryClient]);

  const query = useQuery({
    queryKey: ['swapCalculation', sourceToken?.address, sourceToken?.chainId, targetToken?.address, targetToken?.chainId, usdAmount],
    queryFn: async () => {
      if (!sourceToken || !targetToken || usdAmount <= 0 || !isFinite(usdAmount)) {
        throw new Error('Missing required tokens or invalid USD amount for swap calculation');
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
      const sourceAmount = usdAmount / sourcePrice;
      const targetAmount = usdAmount / targetPrice;

      // Validate calculated amounts
      if (!isFinite(sourceAmount) || !isFinite(targetAmount)) {
        throw new Error('Invalid calculated amounts');
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
    enabled: isEnabled && usdAmount > 0 && isFinite(usdAmount),
    staleTime: 60 * 1000, // Refresh every 60 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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

  // Manual refresh function
  const manualRefresh = () => {
    if (isEnabled) {
      query.refetch();
      setCountdown(60); // Reset countdown
    }
  };

  return {
    data: query.data,
    isLoading: query.isFetching,
    error: query.error,
    isError: query.isError,
    countdown,
    manualRefresh,
  };
};