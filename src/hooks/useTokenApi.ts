import { useQuery } from '@tanstack/react-query';
import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import type { Token, TokenPrice } from '../types';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

// Query keys for React Query
export const tokenQueryKeys = {
  tokenInfo: (chainId: string, symbol: string) => ['tokenInfo', chainId, symbol] as const,
  tokenPrice: (chainId: string, contractAddress: string) => ['tokenPrice', chainId, contractAddress] as const,
};

// Hook to get token information
export const useTokenInfo = (chainId: string, symbol: string) => {
  return useQuery({
    queryKey: tokenQueryKeys.tokenInfo(chainId, symbol),
    queryFn: async (): Promise<Token> => {
      const response = await getAssetErc20ByChainAndSymbol({
        apiKey: API_KEY,
        chainId,
        symbol,
      });

      if (!response) {
        throw new Error(`Failed to fetch token info for ${symbol}`);
      }

      return {
        symbol: response.symbol || symbol,
        name: response.name || symbol,
        decimals: response.decimals,
        address: response.address,
        chainId,
      };
    },
    enabled: !!chainId && !!symbol,
    staleTime: 10 * 60 * 1000, // Token info rarely changes, cache for 10 minutes
  });
};

// Hook to get token price
export const useTokenPrice = (chainId: string, contractAddress: string) => {
  return useQuery({
    queryKey: tokenQueryKeys.tokenPrice(chainId, contractAddress),
    queryFn: async (): Promise<TokenPrice> => {
      const priceInfo = await getAssetPriceInfo({
        apiKey: API_KEY,
        chainId,
        assetTokenAddress: contractAddress,
      });

      if (!priceInfo || typeof priceInfo.unitPrice !== 'number') {
        throw new Error(`Failed to fetch price for token at ${contractAddress}`);
      }

      if (priceInfo.unitPrice <= 0) {
        throw new Error(`Invalid price received for token at ${contractAddress}`);
      }

      return {
        price: priceInfo.unitPrice,
        priceUsd: priceInfo.unitPrice,
        timestamp: Date.now(),
      };
    },
    enabled: !!chainId && !!contractAddress,
    staleTime: 30 * 1000, // Prices change frequently, cache for 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
};

// Hook for swap calculation
export const useSwapCalculation = (
  sourceToken: Token | null,
  targetToken: Token | null,
  usdAmount: number
) => {
  // Get token addresses, using placeholder for native tokens
  const sourceAddress = sourceToken?.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  const targetAddress = targetToken?.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  
  const sourcePriceQuery = useTokenPrice(
    sourceToken?.chainId || '',
    sourceAddress
  );
  const targetPriceQuery = useTokenPrice(
    targetToken?.chainId || '',
    targetAddress
  );

  const isEnabled = 
    !!sourceToken &&
    !!targetToken &&
    usdAmount > 0;

  return useQuery({
    queryKey: ['swapCalculation', sourceToken?.address, targetToken?.address, usdAmount],
    queryFn: async () => {
      if (!sourceToken || !targetToken) {
        throw new Error('Missing required tokens for swap calculation');
      }

      // Wait for price data to be available
      if (!sourcePriceQuery.data || !targetPriceQuery.data) {
        throw new Error('Price data not yet available');
      }

      const sourcePrice = sourcePriceQuery.data.price;
      const targetPrice = targetPriceQuery.data.price;

      if (sourcePrice <= 0 || targetPrice <= 0) {
        throw new Error('Invalid price data received');
      }

      // Calculate token amounts based on USD value
      const sourceAmount = usdAmount / sourcePrice;
      const targetAmount = usdAmount / targetPrice;

      return {
        sourceAmount: Number(sourceAmount.toFixed(6)),
        targetAmount: Number(targetAmount.toFixed(6)),
        sourceToken,
        targetToken,
        usdAmount,
      };
    },
    enabled: isEnabled && !!sourcePriceQuery.data && !!targetPriceQuery.data,
    staleTime: 10 * 1000, // Swap calculations should be fresh
  });
};