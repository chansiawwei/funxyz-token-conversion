import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Token, SUPPORTED_TOKENS } from '../types';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  label: string;
  excludeToken?: Token | null;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  label,
  excludeToken
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableTokens = SUPPORTED_TOKENS.filter(
    token => !excludeToken || token.symbol !== excludeToken.symbol
  );

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {selectedToken.symbol.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{selectedToken.symbol}</div>
                <div className="text-sm text-gray-500">{selectedToken.name}</div>
              </div>
            </>
          ) : (
            <span className="text-gray-500">Select a token</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {availableTokens.map((token) => (
            <button
              key={`${token.symbol}-${token.chainId}`}
              type="button"
              onClick={() => handleTokenSelect(token)}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {token.symbol.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{token.symbol}</div>
                <div className="text-sm text-gray-500">{token.name}</div>
                <div className="text-xs text-gray-400">Chain ID: {token.chainId}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};