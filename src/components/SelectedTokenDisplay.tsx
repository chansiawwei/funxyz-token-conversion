import React from 'react';
import { Token } from '../types';

interface SelectedTokenDisplayProps {
  selectedToken: Token | null;
  title?: string;
}

export const SelectedTokenDisplay: React.FC<SelectedTokenDisplayProps> = ({ 
  selectedToken, 
  title = "Selected Token" 
}) => {
  if (!selectedToken) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      <div className="flex items-start space-x-4">
        {selectedToken.logoURI && (
          <img
            src={selectedToken.logoURI}
            alt={selectedToken.symbol}
            className="h-12 w-12 rounded-full flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=${selectedToken.symbol.charAt(0)}`;
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedToken.symbol}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {selectedToken.chainName || `Chain ${selectedToken.chainId}`}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {selectedToken.name}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <div className="mb-1">
              <span className="font-medium">Address:</span> 
              <span className="font-mono break-all">{selectedToken.address}</span>
            </div>
            <div>
              <span className="font-medium">Decimals:</span> {selectedToken.decimals}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};