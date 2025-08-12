import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAssetErc20ByChainAndSymbol } from '@funkit/api-base';
import type { Token } from '../types';
import { API_KEY } from '../constants';

/**
 * Single hook for token information fetching
 * Provides both reactive querying and imperative fetching capabilities
 */
export const useTokenInfo = (chainId?: string, symbol?: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tokenInfo', chainId, symbol],
    queryFn: async () => {
      if (!chainId || !symbol) throw new Error('Missing chainId or symbol');
      
      const response = await getAssetErc20ByChainAndSymbol({
        apiKey: API_KEY,
        chainId,
        symbol,
      });

      if (!response) {
        throw new Error(`Failed to fetch token info for ${symbol} on chain ${chainId}`);
      }

      return {
        symbol: response.symbol || symbol,
        name: response.name || symbol,
        decimals: response.decimals,
        address: response.address,
        chainId,
      } as Token;
    },
    enabled: enabled && !!chainId && !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Imperative fetch function using the same query configuration
  const fetchTokenInfo = async (basicToken: Token): Promise<Token> => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ['tokenInfo', basicToken.chainId, basicToken.symbol],
        queryFn: async () => {
          const apiResponse = await getAssetErc20ByChainAndSymbol({
            apiKey: API_KEY,
            chainId: basicToken.chainId,
            symbol: basicToken.symbol,
          });

          if (!apiResponse) {
            throw new Error(`Failed to fetch token info for ${basicToken.symbol}`);
          }

          return {
            symbol: apiResponse.symbol || basicToken.symbol,
            name: apiResponse.name || basicToken.name,
            decimals: apiResponse.decimals,
            address: apiResponse.address,
            chainId: basicToken.chainId,
          } as Token;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      });

      return {
        ...basicToken,
        ...response,
        logoURI: basicToken.logoURI,
        chainName: basicToken.chainName,
      };
    } catch (error) {
      console.error(`Error loading token info for ${basicToken.symbol} on ${basicToken.chainName}:`, error);
      return basicToken;
    }
  };

  return {
    ...query,
    fetchTokenInfo,
  };
};