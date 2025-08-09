import React, { useState, useMemo, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon, CursorArrowRaysIcon } from '@heroicons/react/20/solid';
import { FixedSizeList as List } from 'react-window';
import { useVirtualScrollTokens } from '../hooks/useVirtualizedTokens';
import { Token, SUPPORTED_CHAINS } from '../types';

interface VirtualizedTokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
  label: string;
  placeholder?: string;
  excludeToken?: Token | null;
}

// Individual token item component for virtual list
const TokenItem = React.memo(({ index, style, data }: {
  index: number;
  style: React.CSSProperties;
  data: {
    tokens: Token[];
    selectedToken: Token | null;
    onSelect: (token: Token) => void;
  };
}) => {
  const { tokens, selectedToken, onSelect } = data;
  const token = tokens[index];

  if (!token) {
    return (
      <div style={style} className="px-4 py-2 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  const isSelected = selectedToken?.address === token.address && 
                   selectedToken?.chainId === token.chainId;

  return (
    <Listbox.Option
      key={`${token.address}-${token.chainId}`}
      value={token}
      style={style}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pl-10 pr-4 ${
          active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
        }`
      }
      onClick={() => onSelect(token)}
    >
      {({ selected, active }) => (
        <>
          <div className="flex items-center">
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="h-6 w-6 rounded-full mr-3"
              />
            )}
            <div className="flex flex-col">
              <span className={`block truncate ${
                selected ? 'font-medium' : 'font-normal'
              }`}>
                {token.symbol}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {token.name} • {token.chainName}
              </span>
            </div>
          </div>
          {(selected || isSelected) && (
            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
              active ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
});

TokenItem.displayName = 'TokenItem';

export const VirtualizedTokenSelector: React.FC<VirtualizedTokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  label,
  placeholder = "Select a token",
  excludeToken
}) => {
  const [networkFilter, setNetworkFilter] = useState<number | null>(null);
  
  const {
    tokens: allTokens,
    visibleTokens,
    handleScroll,
    isLoading,
    isFetchingNextPage,
    hasError,
    hasNextPage,
    fetchNextPage
  } = useVirtualScrollTokens(networkFilter);

  // Filter out excluded token from all tokens for count purposes
  const allFilteredTokens = useMemo(() => {
    if (!excludeToken) return allTokens;
    return allTokens.filter(token => 
      !(token.address === excludeToken.address && token.chainId === excludeToken.chainId)
    );
  }, [allTokens, excludeToken]);

  // Use visible tokens for display, but filter out excluded token
  const tokens = useMemo(() => {
    if (!excludeToken) return visibleTokens;
    return visibleTokens.filter(token => 
      !(token.address === excludeToken.address && token.chainId === excludeToken.chainId)
    );
  }, [visibleTokens, excludeToken]);

  const handleNetworkFilterChange = useCallback((chainId: number | null) => {
    setNetworkFilter(chainId);
    // Clear selection if it doesn't match the new filter
    if (chainId && selectedToken && parseInt(selectedToken.chainId) !== chainId) {
      onTokenSelect(null);
    }
  }, [selectedToken, onTokenSelect]);

  const handleTokenSelect = useCallback((token: Token) => {
    onTokenSelect(token);
  }, [onTokenSelect]);



  // Handle scroll events for virtual list
  const handleItemsRendered = useCallback((
    { visibleStartIndex, visibleStopIndex }: {
      visibleStartIndex: number;
      visibleStopIndex: number;
    }
  ) => {
    handleScroll(visibleStartIndex, visibleStopIndex);
  }, [handleScroll]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      {/* Network Filter */}
      <div className="mb-3">
        <Listbox value={networkFilter} onChange={handleNetworkFilterChange}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border border-gray-300 dark:border-gray-600 min-w-0">
              <span className="block truncate text-gray-900 dark:text-white">
                {networkFilter 
                  ? SUPPORTED_CHAINS.find(chain => chain.id === networkFilter)?.name || 'Unknown Network'
                  : 'All Networks'
                }
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none sm:text-sm">
                <Listbox.Option
                  value={null}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}>
                        All Networks
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
                {SUPPORTED_CHAINS.map((chain) => (
                  <Listbox.Option
                    key={chain.id}
                    value={chain.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}>
                          {chain.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Token Selector */}
      <Listbox value={selectedToken} onChange={onTokenSelect}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border border-gray-300 dark:border-gray-600 min-h-[76px] flex items-center min-w-0">
            {selectedToken ? (
              <div className="flex items-center w-full">
                {selectedToken.logoURI && (
                  <img
                    src={selectedToken.logoURI}
                    alt={selectedToken.symbol}
                    className="h-8 w-8 rounded-full mr-3 flex-shrink-0"
                  />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="block truncate font-medium text-gray-900 dark:text-white">
                    {selectedToken.symbol}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {selectedToken.name} • {selectedToken.chainName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <CursorArrowRaysIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-1.5" />
                <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
              </div>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full max-w-full overflow-hidden rounded-md bg-white dark:bg-gray-700 text-base shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none sm:text-sm left-0 right-0">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
                  Loading tokens...
                </div>
              ) : hasError ? (
                <div className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                  Error loading tokens. Please try again.
                </div>
              ) : tokens.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {networkFilter 
                    ? 'No tokens available for selected network'
                    : 'No tokens available'
                  }
                </div>
              ) : (
                <div className="max-h-60">
                  <List
                    height={Math.min(240, allFilteredTokens.length * 60)} // Max 240px or actual content height
                    width="100%"
                    itemCount={allFilteredTokens.length}
                    itemSize={60}
                    itemData={{
                      tokens: allFilteredTokens,
                      selectedToken,
                      onSelect: handleTokenSelect,
                    }}
                    onItemsRendered={handleItemsRendered}
                  >
                    {TokenItem}
                  </List>
                  
                  {/* Loading indicator for next page */}
                  {isFetchingNextPage && (
                    <div className="px-4 py-2 text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                    </div>
                  )}
                  
                  {/* Load more button if needed */}
                  {hasNextPage && !isFetchingNextPage && (
                    <div className="px-4 py-2 border-t dark:border-gray-600">
                      <button
                        onClick={() => fetchNextPage()}
                        className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Load more tokens...
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Token count info */}
              {allFilteredTokens.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  Showing {allFilteredTokens.length} token{allFilteredTokens.length !== 1 ? 's' : ''}
                  {networkFilter && ` on ${SUPPORTED_CHAINS.find(c => c.id === networkFilter)?.name}`}
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};