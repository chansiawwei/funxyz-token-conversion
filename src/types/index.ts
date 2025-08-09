export interface Token {
  symbol: string;
  name: string;
  chainId: string;
  address?: string;
  decimals?: number;
  logoURI?: string;
  chainName?: string;
}

export interface TokenPrice {
  price: number;
  priceUsd: number;
  timestamp: number;
}

export interface SwapCalculation {
  sourceAmount: number;
  targetAmount: number;
  usdAmount: number;
  sourceToken: Token;
  targetToken: Token;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface Chain {
  id: number;
  name: string;
  symbol: string;
}

// Token configurations organized by chain ID - symbols only, addresses fetched from API
export const TOKEN_CONFIGS: Record<number, string[]> = {
  1: ['USDC', 'WBTC'], // Ethereum Mainnet
  137: ['USDT'], // Polygon
  8453: ['ETH'], // Base
};

// Token icon mapping using jsDelivr CDN for cryptocurrency icons
export const TOKEN_ICONS: Record<string, string> = {
  // Major cryptocurrencies
  'ETH': 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/eth.svg',
  'WBTC': 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/btc.svg',
  
  // Stablecoins
  'USDC': 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/usdc.svg',
  'USDT': 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/usdt.svg',
};

// Chain information
export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 8453, name: 'Base', symbol: 'ETH' },
] as const;