export interface Token {
  symbol: string;
  name: string;
  chainId: string;
  address?: string;
  decimals?: number;
  logoURI?: string;
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

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    chainId: '1',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    chainId: '1',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    chainId: '1',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    chainId: '1',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
  },
];