import React, { useState, useMemo, useCallback, memo } from 'react';
import { ArrowLeftRight, ArrowUpDown, Loader2 } from 'lucide-react';
import { VirtualizedTokenSelector } from './VirtualizedTokenSelector';
import { SelectedTokenDisplay } from './SelectedTokenDisplay';
import { SkeletonCard, SkeletonSpinner } from './Skeleton';
import { Token } from '../types';
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

  // Skeleton loader when both tokens selected, USD amount is entered, but no result yet
  if (sourceToken && targetToken && usdAmountNumber > 0 && (isLoading || !swapResult) && !error) {
    return (
      <div className="relative">
        <SkeletonCard />
        {isLoading && (
          <div className="absolute top-4 right-4">
            <SkeletonSpinner size="sm" />
          </div>
        )}
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
  const [usdAmount, setUsdAmount] = useState<string>('');

  const usdAmountNumber = useMemo(() => parseFloat(usdAmount) || 0, [usdAmount]);
  
  // Use improved React Query hook for swap calculation
  const {
    data: swapResult,
    isLoading,
    error,
  } = useImprovedSwapCalculation(sourceToken, targetToken, usdAmountNumber);

  const handleSwapTokens = useCallback(() => {
    if (!sourceToken || !targetToken) return;
    
    // Use functional updates to ensure consistency
    setSourceToken(targetToken);
    setTargetToken(sourceToken);
  }, [sourceToken, targetToken]);



  const handleSourceTokenSelect = useCallback((token: Token | null) => {
    setSourceToken(token);
  }, []);

  const handleTargetTokenSelect = useCallback((token: Token | null) => {
    setTargetToken(token);
  }, []);

  const handleUsdAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value);
  }, []);

  const formatNumber = (num: number, decimals: number = 6): string => {
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(decimals).replace(/\.?0+$/, '');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors duration-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Token Swap</h2>
          <p className="text-gray-600 dark:text-gray-300">Enter a USD amount to see equivalent token values</p>
        </div>



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
              step="0.01"
            />
          </div>
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
              />
            </div>
          </div>
        </div>

        {/* Selected Token Displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SelectedTokenDisplay selectedToken={sourceToken} title="Source Token" />
          <SelectedTokenDisplay selectedToken={targetToken} title="Target Token" />
        </div>

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
    </div>
  );
};