import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { TOKEN_CONFIGS, TOKEN_ICONS, Token, SUPPORTED_CHAINS } from '../types';
import { getAssetErc20ByChainAndSymbol } from '@funkit/api-base';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

/**
 * Virtualized token fetching hook with pagination
 * Fetches tokens in chunks for better performance with large lists
 */
export const useVirtualizedTokens = (pageSize: number = 3) => {
  // Get all possible token-chain combinations
  const allTokenChainPairs = useMemo(() => {
    return SUPPORTED_CHAINS.flatMap(chain => 
      (TOKEN_CONFIGS[chain.id] || []).map(symbol => ({ 
        symbol, 
        chainId: chain.id, 
        chainName: chain.name 
      }))
    );
  }, []);

  return useInfiniteQuery({
    queryKey: ['virtualizedTokens', pageSize],
    queryFn: async ({ pageParam = 0 }): Promise<{ tokens: Token[]; nextPage: number | null }> => {
      const startIndex = pageParam * pageSize;
      const endIndex = startIndex + pageSize;
      const pageTokens = allTokenChainPairs.slice(startIndex, endIndex);

      if (pageTokens.length === 0) {
        return { tokens: [], nextPage: null };
      }

      // Fetch tokens for this page
      const tokenPromises = pageTokens.map(async ({ symbol, chainId, chainName }) => {
        try {
          const response = await getAssetErc20ByChainAndSymbol({
            apiKey: API_KEY,
            chainId: chainId.toString(),
            symbol,
          });

          if (!response) {
            console.warn(`Failed to fetch token info for ${symbol} on ${chainName}`);
            return null;
          }

          return {
            symbol: response.symbol || symbol,
            name: response.name || symbol,
            decimals: response.decimals,
            address: response.address,
            chainId: chainId.toString(),
            logoURI: TOKEN_ICONS[symbol] || undefined,
            chainName,
          } as Token;
        } catch (error) {
          console.warn(`Error fetching ${symbol} on ${chainName}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(tokenPromises);
      const tokens = results
        .filter((result): result is PromiseFulfilledResult<Token> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value)
        .sort((a, b) => {
          if (a.symbol !== b.symbol) {
            return a.symbol.localeCompare(b.symbol);
          }
          return (a.chainName || '').localeCompare(b.chainName || '');
        });

      const hasNextPage = endIndex < allTokenChainPairs.length;
      const nextPage = hasNextPage ? pageParam + 1 : null;

      return { tokens, nextPage };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook for virtualized tokens filtered by network
 */
export const useVirtualizedTokensByNetwork = (chainId: number | null, pageSize: number = 3) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useVirtualizedTokens(pageSize);

  // Flatten all pages and filter by network
  const allTokens = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.tokens);
  }, [data]);

  const filteredTokens = useMemo(() => {
    if (!chainId) return allTokens;
    return allTokens.filter(token => parseInt(token.chainId) === chainId);
  }, [allTokens, chainId]);

  return {
    tokens: filteredTokens,
    allTokens, // For total count
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    hasError: !!error,
    error,
    totalTokensCount: allTokens.length,
  };
};

/**
 * Hook for virtual scrolling with automatic loading
 */
export const useVirtualScrollTokens = (chainId: number | null) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const pageSize = 3;
  
  // Reset visible range when network filter changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: 3 });
  }, [chainId]);
  
  const {
    tokens,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    hasError,
    error,
    totalTokensCount
  } = useVirtualizedTokensByNetwork(chainId, pageSize);

  // Auto-fetch next page when scrolling near the end
  const handleScroll = (startIndex: number, endIndex: number) => {
    setVisibleRange({ start: startIndex, end: endIndex });
    
    // If we're near the end and there are more pages, fetch next
    const threshold = Math.max(1, Math.floor(pageSize * 0.7)); // 70% of page size
    if (endIndex >= tokens.length - threshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Get visible tokens for current range
  const visibleTokens = useMemo(() => {
    return tokens.slice(visibleRange.start, visibleRange.end + 1);
  }, [tokens, visibleRange]);

  return {
    tokens,
    visibleTokens,
    visibleRange,
    handleScroll,
    isLoading,
    isFetchingNextPage,
    hasError,
    error,
    totalTokensCount,
    hasNextPage,
    fetchNextPage,
  };
};