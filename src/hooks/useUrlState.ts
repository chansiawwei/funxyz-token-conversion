import { useState, useEffect, useCallback } from 'react';
import { Token } from '../types';
import { useTokenInfo } from './useTokenInfo';
import { SUPPORTED_CHAINS, TOKEN_CONFIGS, TOKEN_ICONS } from '../types';

interface UrlState {
  usdAmount: string;
  sourceToken: Token | null;
  targetToken: Token | null;
}

interface UrlStateHook extends UrlState {
  updateUsdAmount: (amount: string) => void;
  updateSourceToken: (token: Token | null) => void;
  updateTargetToken: (token: Token | null) => void;
  swapTokens: () => void;
  isLoading: boolean;
}

// URL parameter keys
const URL_PARAMS = {
  AMOUNT: 'amount',
  FROM: 'from',
  TO: 'to',
} as const;

// Utility functions for token serialization
const serializeToken = (token: Token | null): string => {
  if (!token) return '';
  return token.symbol.toLowerCase();
};

const deserializeToken = (tokenStr: string): Token | null => {
  if (!tokenStr) return null;
  const symbol = tokenStr.toUpperCase();
  
  // Find the first chain that supports this symbol
  for (const chain of SUPPORTED_CHAINS) {
    const supportedSymbols = TOKEN_CONFIGS[chain.id];
    if (supportedSymbols && supportedSymbols.includes(symbol)) {
      return {
        symbol,
        chainId: chain.id.toString(),
        name: symbol, // Will be updated when token is loaded
        logoURI: TOKEN_ICONS[symbol],
        chainName: chain.name,
      };
    }
  }
  
  return null;
};

// USD amount validation
const validateUsdAmount = (amount: string): string => {
  if (!amount) return '';
  const numValue = parseFloat(amount);
  if (isNaN(numValue) || numValue < 0) return '';
  if (numValue > 100000000000) return '100000000000'; // Cap at 100 billion
  return amount;
};

// URL management utilities
const getUrlParams = (): URLSearchParams => {
  const url = new URL(window.location.href);
  return new URLSearchParams(url.search);
};

const updateUrl = (params: URLSearchParams): void => {
  const url = new URL(window.location.href);
  const newUrl = `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
};

const setUrlParam = (params: URLSearchParams, key: string, value: string | null): void => {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

export const useUrlState = (): UrlStateHook => {
  const [state, setState] = useState<UrlState>({
    usdAmount: '',
    sourceToken: null,
    targetToken: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { fetchTokenInfo } = useTokenInfo();

  // Load initial state from URL
  useEffect(() => {
    const loadFromUrl = async () => {
      try {
        setIsLoading(true);
        const params = getUrlParams();
        
        const amountParam = params.get(URL_PARAMS.AMOUNT);
        const fromParam = params.get(URL_PARAMS.FROM);
        const toParam = params.get(URL_PARAMS.TO);
        
        const newState: UrlState = {
          usdAmount: amountParam ? validateUsdAmount(amountParam) : '',
          sourceToken: null,
          targetToken: null,
        };
        
        // Load source token
        if (fromParam) {
          const basicToken = deserializeToken(fromParam);
          if (basicToken) {
            try {
              newState.sourceToken = await fetchTokenInfo(basicToken);
            } catch (error) {
              console.warn('Failed to load source token:', error);
            }
          }
        }
        
        // Load target token
        if (toParam) {
          const basicToken = deserializeToken(toParam);
          if (basicToken) {
            try {
              newState.targetToken = await fetchTokenInfo(basicToken);
            } catch (error) {
              console.warn('Failed to load target token:', error);
            }
          }
        }
        
        setState(newState);
      } catch (error) {
        console.error('Failed to load state from URL:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFromUrl();
  }, [fetchTokenInfo]);

  // Update URL when state changes
  const syncToUrl = useCallback((newState: UrlState) => {
    const params = getUrlParams();
    
    setUrlParam(params, URL_PARAMS.AMOUNT, newState.usdAmount);
    setUrlParam(params, URL_PARAMS.FROM, serializeToken(newState.sourceToken));
    setUrlParam(params, URL_PARAMS.TO, serializeToken(newState.targetToken));
    
    updateUrl(params);
  }, []);

  // State update functions
  const updateUsdAmount = useCallback((amount: string) => {
    const validatedAmount = validateUsdAmount(amount);
    const newState = { ...state, usdAmount: validatedAmount };
    setState(newState);
    syncToUrl(newState);
  }, [state, syncToUrl]);

  const updateSourceToken = useCallback((token: Token | null) => {
    const newState = { ...state, sourceToken: token };
    setState(newState);
    syncToUrl(newState);
  }, [state, syncToUrl]);

  const updateTargetToken = useCallback((token: Token | null) => {
    const newState = { ...state, targetToken: token };
    setState(newState);
    syncToUrl(newState);
  }, [state, syncToUrl]);

  const swapTokens = useCallback(() => {
    if (!state.sourceToken || !state.targetToken) return;
    
    const newState = {
      ...state,
      sourceToken: state.targetToken,
      targetToken: state.sourceToken,
    };
    setState(newState);
    syncToUrl(newState);
  }, [state, syncToUrl]);

  return {
    ...state,
    updateUsdAmount,
    updateSourceToken,
    updateTargetToken,
    swapTokens,
    isLoading,
  };
};