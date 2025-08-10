import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { FixedSizeList as List } from 'react-window';
import { VirtualizedTokenSelector } from './VirtualizedTokenSelector';
import { Token } from '../types';

// Simple mock data generator for virtualization testing
const generateMockTokens = (count: number): Token[] => {
  const chains = ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'];
  const chainIds = ['1', '137', '56', '42161', '10'];
  const symbols = ['ETH', 'USDC', 'USDT', 'DAI', 'WETH', 'MATIC', 'BNB', 'AVAX', 'OP', 'ARB', 'LINK', 'UNI', 'AAVE', 'CRV', 'COMP'];
  
  const mockTokens: Token[] = [];
  
  for (let i = 0; i < count; i++) {
    const symbol = symbols[i % symbols.length];
    const chainIndex = Math.floor(Math.random() * chains.length);
    const suffix = i >= symbols.length ? `-${Math.floor(i / symbols.length) + 1}` : '';
    
    mockTokens.push({
      symbol: `${symbol}${suffix}`,
      name: `${symbol} Token${suffix ? ` V${Math.floor(i / symbols.length) + 1}` : ''}`,
      chainId: chainIds[chainIndex],
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      decimals: 18,
      logoURI: `https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=${symbol.charAt(0)}`,
    });
  }
  
  return mockTokens;
};

const meta: Meta<typeof VirtualizedTokenSelector> = {
  title: 'Components/VirtualizedTokenSelector',
  component: VirtualizedTokenSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A virtualized token selector component that efficiently handles large lists of tokens using react-window for performance optimization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedToken: {
      description: 'Currently selected token',
      control: { type: 'object' },
    },
    onTokenSelect: {
      description: 'Callback function when a token is selected',
      action: 'tokenSelected',
    },
    label: {
      description: 'Label for the token selector',
      control: { type: 'text' },
    },
    placeholder: {
      description: 'Placeholder text for the search input',
      control: { type: 'text' },
    },
    excludeToken: {
      description: 'Token to exclude from the list',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock version of the VirtualizedTokenSelector that uses provided mock data
const MockVirtualizedTokenSelector: React.FC<{
  tokens: Token[];
  selectedToken: Token | null;
  onTokenSelect: (token: Token | null) => void;
  label: string;
  placeholder?: string;
  excludeToken?: Token | null;
}> = ({ tokens, selectedToken, onTokenSelect, label, placeholder, excludeToken }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter tokens based on search term and exclude token
  const filteredTokens = React.useMemo(() => {
    let filtered = tokens;
    
    if (excludeToken) {
      filtered = filtered.filter(token => 
        !(token.address === excludeToken.address && token.chainId === excludeToken.chainId)
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(token => 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [tokens, searchTerm, excludeToken]);

  const TokenListItem = ({ index, style, data }: { 
     index: number; 
     style: React.CSSProperties;
     data: { tokens: Token[]; selectedToken: Token | null; onSelect: (token: Token) => void; };
   }) => {
     const { tokens, selectedToken, onSelect } = data;
     const token = tokens[index];
     if (!token) return null;

     const isSelected = selectedToken?.address === token.address && selectedToken?.chainId === token.chainId;

     return (
       <div
         style={style}
         className={`cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center space-x-3 ${
           isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : ''
         }`}
         onClick={() => onSelect(token)}
       >
         <img
           src={token.logoURI}
           alt={token.symbol}
           className="w-8 h-8 rounded-full"
           onError={(e) => {
             (e.target as HTMLImageElement).src = `https://via.placeholder.com/32x32/3B82F6/FFFFFF?text=${token.symbol.charAt(0)}`;
           }}
         />
         <div className="flex-1">
           <div className="font-medium text-gray-900 dark:text-white">{token.symbol}</div>
           <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
         </div>
         <div className="text-xs text-gray-400 dark:text-gray-500">Chain: {token.chainId}</div>
         {isSelected && (
           <CheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
         )}
       </div>
     );
   };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            {selectedToken ? (
              <>
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="h-6 w-6 rounded-full mr-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/24x24/3B82F6/FFFFFF?text=${selectedToken.symbol.charAt(0)}`;
                  }}
                />
                <span className="block truncate font-medium">{selectedToken.symbol}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({selectedToken.name})</span>
              </>
            ) : (
              <span className="block truncate text-gray-500 dark:text-gray-400">{placeholder}</span>
            )}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-600">
            
            <div className="max-h-60">
               {filteredTokens.length > 0 ? (
                 <List
                   height={240}
                   width="100%"
                   itemCount={filteredTokens.length}
                   itemSize={60}
                   itemData={{
                     tokens: filteredTokens,
                     selectedToken,
                     onSelect: (token: Token) => {
                       onTokenSelect(token);
                       setIsOpen(false);
                     }
                   }}
                 >
                   {TokenListItem}
                 </List>
               ) : (
                 <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                   No tokens found
                 </div>
               )}
             </div>
             
             {/* Token count info */}
             {filteredTokens.length > 0 && (
               <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                 Showing {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// Interactive wrapper to demonstrate virtualization with large datasets
const VirtualizationDemo: React.FC = () => {
  const [selected, setSelected] = React.useState<Token | null>(null);
  
  // Generate a large dataset to demonstrate virtualization
  const mockTokens = React.useMemo(() => generateMockTokens(5000), []);
  
  return (
    <div className="w-96 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Virtualization Performance Test</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This demo uses {mockTokens.length} mock tokens to showcase virtualization. 
          The component dynamically renders only visible items for optimal performance.
        </p>
      </div>
      
      <MockVirtualizedTokenSelector
         tokens={mockTokens}
         selectedToken={selected}
         onTokenSelect={setSelected}
         label="Select Token (Large Dataset)"
         placeholder="Search through thousands of tokens..."
       />
      
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-800 dark:text-green-200">
          <span className="font-medium">💡 Mock Data:</span>
        </p>
        <ul className="text-xs text-green-700 dark:text-green-300 mt-1 space-y-1">
          <li>• Generated {mockTokens.length} tokens for testing</li>
          <li>• Shows component behavior with large datasets</li>
        </ul>
      </div>
    </div>
  );
};

// Stories using the actual VirtualizedTokenSelector component
export const Default: Story = {
  args: {
    selectedToken: null,
    label: 'Select Token',
    placeholder: 'Choose a token...',
  },
};

export const WithSelectedToken: Story = {
  args: {
    selectedToken: {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      decimals: 6,
      chainId: '1',
      chainName: 'Ethereum',
      logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    label: 'Source Token',
    placeholder: 'Select source token...',
  },
};

// Single story focused on virtualization demonstration with mock data
export const VirtualizationPerformanceTest: Story = {
  render: () => <VirtualizationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates virtualization performance with a large mock dataset. The component uses react-window to efficiently render only visible items, ensuring smooth performance even with thousands of tokens.',
      },
    },
  },
};