import { useState, useMemo, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon, CursorArrowRaysIcon } from '@heroicons/react/20/solid';
import { SkeletonSpinner } from './Skeleton';
import { Token, SUPPORTED_CHAINS, TOKEN_CONFIGS, TOKEN_ICONS } from '../types';
import { useTokenInfo } from '../hooks/useTokenInfo';

// Common styles for dropdown buttons
const DROPDOWN_BUTTON_STYLES = "relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border border-gray-300 dark:border-gray-600 min-w-0";

// Common styles for dropdown options
const DROPDOWN_OPTION_STYLES = (active: boolean) => 
  `relative cursor-default select-none py-2 pl-10 pr-4 ${
    active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
  }`;

const TOKEN_OPTION_STYLES = (active: boolean) => 
  `relative cursor-default select-none py-3 pl-3 pr-9 ${
    active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
  }`;

interface VirtualizedTokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
  label: string;
  placeholder?: string;
  excludeToken?: Token | null;
  networkFilter?: number | null;
  onNetworkFilterChange?: (chainId: number | null) => void;
}

// Individual token item component for virtual list
export const VirtualizedTokenSelector = ({
  selectedToken,
  onTokenSelect,
  label,
  placeholder = "Select a token",
  excludeToken,
  networkFilter: externalNetworkFilter,
  onNetworkFilterChange
}: VirtualizedTokenSelectorProps) => {
  const [internalNetworkFilter, setInternalNetworkFilter] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use external network filter if provided, otherwise use internal state
  const networkFilter = externalNetworkFilter !== undefined ? externalNetworkFilter : internalNetworkFilter;
  
  // Generate basic token configs
  const basicTokens = useMemo(() => {
    return SUPPORTED_CHAINS.flatMap(chain => 
      (TOKEN_CONFIGS[chain.id] || []).map(symbol => ({
        symbol,
        name: symbol,
        chainId: chain.id.toString(),
        chainName: chain.name,
        logoURI: TOKEN_ICONS[symbol],
      } as Token))
    );
  }, []);

  // Lazy loading strategy: fetch first 3 tokens immediately, rest when dropdown opens
  const initialTokenCount = 3;
  const shouldFetchAll = isDropdownOpen;
  
  // Fetch token info with lazy loading
  const tokenQueries = basicTokens.map((token, index) => 
    useTokenInfo(
      token.chainId, 
      token.symbol, 
      index < initialTokenCount || shouldFetchAll
    )
  );

  // Combine basic token info with fetched data
  const allTokens = useMemo(() => {
    return basicTokens.map((basicToken, index) => {
      const query = tokenQueries[index];
      if (query.data) {
        return {
          ...basicToken,
          ...query.data,
          chainName: basicToken.chainName, // Keep chain name from basic token
          logoURI: basicToken.logoURI, // Keep logo from basic token
        };
      }
      return basicToken;
    });
  }, [basicTokens, tokenQueries]);

  // Check loading state for visible tokens only
  const visibleTokenQueries = shouldFetchAll ? tokenQueries : tokenQueries.slice(0, initialTokenCount);
  const isLoading = visibleTokenQueries.some(query => query.isLoading);
  const hasError = visibleTokenQueries.some(query => query.isError);

  // Filter tokens by network and exclude token
  const filteredTokens = useMemo(() => {
    let filtered = allTokens;
    
    // Filter by network
    if (networkFilter) {
      filtered = filtered.filter(token => parseInt(token.chainId) === networkFilter);
    }
    
    // Filter out excluded token
    if (excludeToken) {
      filtered = filtered.filter(token => 
        !(token.symbol === excludeToken.symbol && token.chainId === excludeToken.chainId)
      );
    }
    
    return filtered;
  }, [allTokens, networkFilter, excludeToken]);

  const handleNetworkFilterChange = useCallback((chainId: number | null) => {
    if (onNetworkFilterChange) {
      onNetworkFilterChange(chainId);
    } else {
      setInternalNetworkFilter(chainId);
    }
    // Clear selection if it doesn't match the new filter
    if (chainId && selectedToken && parseInt(selectedToken.chainId) !== chainId) {
      onTokenSelect(null);
    }
  }, [selectedToken, onTokenSelect, onNetworkFilterChange]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      {/* Network Filter */}
      <div className="mb-3">
        <Listbox value={networkFilter} onChange={handleNetworkFilterChange}>
          <div className="relative">
            <Listbox.Button className={DROPDOWN_BUTTON_STYLES}>
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
                  className={({ active }) => DROPDOWN_OPTION_STYLES(active)}
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
                    className={({ active }) => DROPDOWN_OPTION_STYLES(active)}
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
          <Listbox.Button 
            className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border border-gray-300 dark:border-gray-600 min-h-[76px] flex items-center min-w-0"
            onClick={() => setIsDropdownOpen(true)}
          >
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
            afterLeave={() => setIsDropdownOpen(false)}
          >
            <Listbox.Options modal={false} className="absolute z-[9999] mt-1 w-full max-h-80 overflow-auto rounded-md bg-white dark:bg-gray-700 text-base shadow-lg ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none sm:text-sm">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <SkeletonSpinner className="mx-auto mb-2" />
                  Loading token information...
                </div>
              ) : hasError ? (
                <div className="px-4 py-8 text-center text-red-500 dark:text-red-400">
                  Error loading token information. Please try again.
                </div>
              ) : filteredTokens.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {networkFilter 
                    ? 'No tokens available for selected network'
                    : 'No tokens available'
                  }
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <Listbox.Option
                    key={`${token.symbol}-${token.chainId}`}
                    value={token}
                    className={({ active }) => TOKEN_OPTION_STYLES(active)}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center">
                          {token.logoURI && (
                            <img
                              src={token.logoURI}
                              alt={token.symbol}
                              className="h-8 w-8 rounded-full mr-3 flex-shrink-0"
                            />
                          )}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}>
                              {token.symbol}
                            </span>
                            <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                              {token.name} • {token.chainName}
                            </span>
                          </div>
                        </div>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 dark:text-blue-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
              
              {/* Token count info */}
              {filteredTokens.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  Showing {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
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