import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import { Token, TokenPrice, ApiResponse } from '../types';

const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';

export class TokenApiService {
  private static instance: TokenApiService;
  private tokenCache = new Map<string, Token>();
  private priceCache = new Map<string, { price: TokenPrice; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): TokenApiService {
    if (!TokenApiService.instance) {
      TokenApiService.instance = new TokenApiService();
    }
    return TokenApiService.instance;
  }

  async getTokenInfo(chainId: string, symbol: string): Promise<ApiResponse<Token>> {
    try {
      const cacheKey = `${chainId}-${symbol}`;
      
      if (this.tokenCache.has(cacheKey)) {
        return {
          data: this.tokenCache.get(cacheKey)!,
          success: true
        };
      }

      const tokenInfo = await getAssetErc20ByChainAndSymbol({
        chainId,
        symbol,
        apiKey: API_KEY
      });

      const token: Token = {
        symbol: tokenInfo.symbol || symbol,
        name: tokenInfo.name || symbol,
        chainId,
        address: tokenInfo.address,
        decimals: tokenInfo.decimals,
        // logoURI: tokenInfo.logoURI
      };

      this.tokenCache.set(cacheKey, token);
      
      return {
        data: token,
        success: true
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      return {
        data: { symbol, name: symbol, chainId },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getTokenPrice(chainId: string, assetTokenAddress: string): Promise<ApiResponse<TokenPrice>> {
    try {
      const cacheKey = `${chainId}-${assetTokenAddress}`;
      const cached = this.priceCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return {
          data: cached.price,
          success: true
        };
      }

      const priceInfo = await getAssetPriceInfo({
        chainId,
        assetTokenAddress,
        apiKey: API_KEY
      });

      const price: TokenPrice = {
        price: priceInfo.unitPrice || 0,
        priceUsd: priceInfo.unitPrice || 0,
        timestamp: Date.now()
      };

      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      
      return {
        data: price,
        success: true
      };
    } catch (error) {
      console.error('Error fetching token price:', error);
      return {
        data: { price: 0, priceUsd: 0, timestamp: Date.now() },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async calculateSwap(sourceToken: Token, targetToken: Token, usdAmount: number): Promise<ApiResponse<{ sourceAmount: number; targetAmount: number }>> {
    try {
      // Get token info to ensure we have addresses
      const [sourceInfo, targetInfo] = await Promise.all([
        this.getTokenInfo(sourceToken.chainId, sourceToken.symbol),
        this.getTokenInfo(targetToken.chainId, targetToken.symbol)
      ]);

      if (!sourceInfo.success || !targetInfo.success) {
        throw new Error('Failed to fetch token information');
      }

      const sourceTokenWithAddress = sourceInfo.data;
      const targetTokenWithAddress = targetInfo.data;

      // For tokens without address (like ETH), use a placeholder or native token address
      const sourceAddress = sourceTokenWithAddress.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
      const targetAddress = targetTokenWithAddress.address || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

      // Get prices for both tokens
      const [sourcePrice, targetPrice] = await Promise.all([
        this.getTokenPrice(sourceToken.chainId, sourceAddress),
        this.getTokenPrice(targetToken.chainId, targetAddress)
      ]);

      if (!sourcePrice.success || !targetPrice.success) {
        throw new Error('Failed to fetch token prices');
      }

      // Calculate amounts
      const sourceAmount = sourcePrice.data.priceUsd > 0 ? usdAmount / sourcePrice.data.priceUsd : 0;
      const targetAmount = targetPrice.data.priceUsd > 0 ? usdAmount / targetPrice.data.priceUsd : 0;

      return {
        data: {
          sourceAmount,
          targetAmount
        },
        success: true
      };
    } catch (error) {
      console.error('Error calculating swap:', error);
      return {
        data: { sourceAmount: 0, targetAmount: 0 },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const tokenApiService = TokenApiService.getInstance();