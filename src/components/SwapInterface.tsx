import React, { useState, useMemo, useCallback, memo } from 'react';
import { ArrowLeftRight, Loader2 } from 'lucide-react';
import { VirtualizedTokenSelector } from './VirtualizedTokenSelector';
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
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700 text-sm">{error.message || 'An error occurred'}</p>
      </div>
    );
  }

  // Swap result
  if (swapResult && !isLoading && !error) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900">Swap Preview</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">USD Amount:</span>
            <span className="font-medium">${formatNumber(swapResult.usdAmount, 2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{swapResult.sourceToken.symbol} Amount:</span>
            <span className="font-medium">
              {formatNumber(swapResult.sourceAmount)} {swapResult.sourceToken.symbol}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{swapResult.targetToken.symbol} Amount:</span>
            <span className="font-medium">
              {formatNumber(swapResult.targetAmount)} {swapResult.targetToken.symbol}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Prices are approximate and may vary. This is for informational purposes only.
          </p>
        </div>
      </div>
    );
  }

  return null;
});

export const SwapInterface: React.FC = () => {
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Swap</h2>
          <p className="text-gray-600">Enter a USD amount to see equivalent token values</p>
        </div>



        {/* USD Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            USD Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              value={usdAmount}
              onChange={handleUsdAmountChange}
              placeholder="0.00"
              className="input-field pl-8"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Token Selection Row */}
        <div className="flex items-end gap-4 mb-6">
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
              className="p-3 rounded-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-colors mb-[2px]"
              disabled={!sourceToken || !targetToken}
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
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