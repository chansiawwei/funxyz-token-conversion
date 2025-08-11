import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { ArrowLeftRight, ArrowUpDown, RefreshCw } from 'lucide-react';
import { VirtualizedTokenSelector } from './VirtualizedTokenSelector';
import { SelectedTokenDisplay } from './SelectedTokenDisplay';
import { SkeletonCard, SkeletonSpinner } from './Skeleton';
import { Token, TOKEN_ICONS, SUPPORTED_CHAINS } from '../types';
import { useImprovedSwapCalculation, formatTokenAmount } from '../hooks/useImprovedSwapCalculation';

// Memoized SwapPreview component to prevent unnecessary rerenders
const SwapPreview = memo(({ swapResult, isLoading, error, sourceToken, targetToken, usdAmountNumber }: {
  swapResult: any;
  isLoading: boolean;
  error: any;
  sourceToken: Token | null;
  targetToken: Token | null;
  usdAmountNumber: number;
}) => {
  // Use the improved formatting function
  const formatNumber = (num: number, decimals: number = 6): string => {
    return formatTokenAmount(num, decimals);
  };

  // Skeleton loader when loading (including refresh)
  if (sourceToken && targetToken && usdAmountNumber > 0 && isLoading) {
    return (
      <div className="relative">
        <SkeletonCard />
        <div className="absolute top-4 right-4">
          <SkeletonSpinner size="sm" />
        </div>
      </div>
    );
  }

  // Show skeleton when no result yet (initial state)
  if (sourceToken && targetToken && usdAmountNumber > 0 && !swapResult && !error) {
    return (
      <div className="relative">
        <SkeletonCard />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
        <p className="text-red-700 dark:text-red-400 text-sm">{error.message || 'An error occurred'}</p>
      </div>
    );
  }

  // Swap result
  if (swapResult && !isLoading && !error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Swap Preview</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">USD Amount:</span>
            <span className="font-medium text-gray-900 dark:text-white">${formatNumber(swapResult.usdAmount, 2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">{swapResult.sourceToken.symbol} Amount:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatNumber(swapResult.sourceAmount)} {swapResult.sourceToken.symbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">{swapResult.targetToken.symbol} Amount:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatNumber(swapResult.targetAmount)} {swapResult.targetToken.symbol}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Prices are approximate and may vary. This is for informational purposes only.
          </p>
        </div>
      </div>
    );
  }

  return null;
});

export const SwapInterface = () => {
  const [sourceToken, setSourceToken] = useState<Token | null>(null);
  const [targetToken, setTargetToken] = useState<Token | null>(null);
  const [sourceNetworkFilter, setSourceNetworkFilter] = useState<number | null>(null);
  const [targetNetworkFilter, setTargetNetworkFilter] = useState<number | null>(null);
  const [usdAmount, setUsdAmount] = useState<string>('');

  // URL parameter handling functions
  const serializeToken = (token: Token | null): string => {
    if (!token) return '';
    return `${token.symbol}:${token.chainId}:${token.address || ''}`;
  };

  const deserializeToken = (tokenStr: string): Token | null => {
    if (!tokenStr) return null;
    const [symbol, chainId, address] = tokenStr.split(':');
    if (!symbol || !chainId) return null;
    
    // Find chain name from SUPPORTED_CHAINS
    const chain = SUPPORTED_CHAINS.find(c => c.id === parseInt(chainId));
    const chainName = chain ? chain.name : `Chain ${chainId}`;
    
    return {
      symbol,
      chainId,
      address: address || undefined,
      name: symbol, // Will be updated when token is loaded
      logoURI: TOKEN_ICONS[symbol], // Add logo from TOKEN_ICONS
      chainName, // Add chain name
    };
  };

  const updateURL = useCallback((newUsdAmount: string, newSourceToken: Token | null, newTargetToken: Token | null) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    // Update USD amount
    if (newUsdAmount) {
      params.set('amount', newUsdAmount);
    } else {
      params.delete('amount');
    }
    
    // Update source token
    const sourceTokenStr = serializeToken(newSourceToken);
    if (sourceTokenStr) {
      params.set('from', sourceTokenStr);
    } else {
      params.delete('from');
    }
    
    // Update target token
    const targetTokenStr = serializeToken(newTargetToken);
    if (targetTokenStr) {
      params.set('to', targetTokenStr);
    } else {
      params.delete('to');
    }
    
    // Update URL without triggering a page reload
    const newUrl = `${url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Load state from URL on component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    const amountParam = params.get('amount');
    const fromParam = params.get('from');
    const toParam = params.get('to');
    
    if (amountParam) {
      setUsdAmount(amountParam);
    }
    
    if (fromParam) {
      const token = deserializeToken(fromParam);
      if (token) {
        setSourceToken(token);
      }
    }
    
    if (toParam) {
      const token = deserializeToken(toParam);
      if (token) {
        setTargetToken(token);
      }
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    updateURL(usdAmount, sourceToken, targetToken);
  }, [usdAmount, sourceToken, targetToken, updateURL]);

  const usdAmountNumber = useMemo(() => parseFloat(usdAmount) || 0, [usdAmount]);
  
  // Use improved React Query hook for swap calculation
  const {
    data: swapResult,
    isLoading,
    error,
    countdown,
    manualRefresh,
  } = useImprovedSwapCalculation(sourceToken, targetToken, usdAmountNumber);

  const handleSwapTokens = useCallback(() => {
    if (!sourceToken || !targetToken) return;
    
    // Use functional updates to ensure consistency
    setSourceToken(targetToken);
    setTargetToken(sourceToken);
    
    // Also swap the network filters
    setSourceNetworkFilter(targetNetworkFilter);
    setTargetNetworkFilter(sourceNetworkFilter);
    
    // Update URL immediately with swapped tokens
    updateURL(usdAmount, targetToken, sourceToken);
  }, [sourceToken, targetToken, sourceNetworkFilter, targetNetworkFilter, usdAmount, updateURL]);



  const handleSourceTokenSelect = useCallback((token: Token | null) => {
    setSourceToken(token);
  }, []);

  const handleTargetTokenSelect = useCallback((token: Token | null) => {
    setTargetToken(token);
  }, []);

  const handleSourceNetworkFilterChange = useCallback((chainId: number | null) => {
    setSourceNetworkFilter(chainId);
  }, []);

  const handleTargetNetworkFilterChange = useCallback((chainId: number | null) => {
    setTargetNetworkFilter(chainId);
  }, []);

  const handleUsdAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Allow empty string or valid numbers within reasonable limits
    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 100000000000)) {
      setUsdAmount(value);
    }
    // If the value exceeds the limit, set it to the maximum
    else if (!isNaN(numValue) && numValue > 100000000000) {
      setUsdAmount('100000000000');
    }
  }, []);


  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Token Explorer</h2>
          <p className="text-gray-600 dark:text-gray-300">Enter a USD amount to see equivalent token values</p>
        </div>

        {/* Price Refresh Status */}
        {sourceToken && targetToken && (
          <div className="mb-6 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Price refresh in: <span className="font-mono font-semibold">{countdown}s</span>
              </div>
            </div>
            <button
              onClick={manualRefresh}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh prices now"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        )}

        {/* USD Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            USD Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              $
            </span>
            <input
              type="number"
              value={usdAmount}
              onChange={handleUsdAmountChange}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-w-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              max="100000000000"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum amount: $100,000,000,000 (100 billion USD)
          </p>
        </div>

        {/* Token Selection - Responsive Layout */}
        <div className="space-y-4 md:space-y-0 mb-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-end gap-4">
            {/* Source Token */}
            <div className="flex-1">
              <VirtualizedTokenSelector
                selectedToken={sourceToken}
                onTokenSelect={handleSourceTokenSelect}
                label="Source Token"
                excludeToken={targetToken}
                networkFilter={sourceNetworkFilter}
                onNetworkFilterChange={handleSourceNetworkFilterChange}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center items-end">
              <button
                onClick={handleSwapTokens}
                className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors mb-[2px]"
                disabled={!sourceToken || !targetToken}
              >
                <ArrowLeftRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Target Token */}
            <div className="flex-1">
              <VirtualizedTokenSelector
                selectedToken={targetToken}
                onTokenSelect={handleTargetTokenSelect}
                label="Target Token"
                excludeToken={sourceToken}
                networkFilter={targetNetworkFilter}
                onNetworkFilterChange={handleTargetNetworkFilterChange}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Source Token */}
            <div className="w-full">
              <VirtualizedTokenSelector
                selectedToken={sourceToken}
                onTokenSelect={handleSourceTokenSelect}
                label="Source Token"
                excludeToken={targetToken}
                networkFilter={sourceNetworkFilter}
                onNetworkFilterChange={handleSourceNetworkFilterChange}
              />
            </div>

            {/* Swap Button - Centered */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapTokens}
                className="p-3 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={!sourceToken || !targetToken}
              >
                <ArrowUpDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Target Token */}
            <div className="w-full">
              <VirtualizedTokenSelector
                selectedToken={targetToken}
                onTokenSelect={handleTargetTokenSelect}
                label="Target Token"
                excludeToken={sourceToken}
                networkFilter={targetNetworkFilter}
                onNetworkFilterChange={handleTargetNetworkFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Selected Token Details */}
        {(sourceToken || targetToken) && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourceToken && (
                <SelectedTokenDisplay 
                  selectedToken={sourceToken} 
                  title="Source Token Details" 
                />
              )}
              {targetToken && (
                <SelectedTokenDisplay 
                  selectedToken={targetToken} 
                  title="Target Token Details" 
                />
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <SwapPreview
          swapResult={swapResult}
          isLoading={isLoading}
          error={error}
          sourceToken={sourceToken}
          targetToken={targetToken}
          usdAmountNumber={usdAmountNumber}
        />

        {!sourceToken || !targetToken || !usdAmount ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {!usdAmount ? 'Enter a USD amount' : 'Select both tokens to see swap preview'}
            </p>
          </div>
        ) : null}
    </div>
  );
};