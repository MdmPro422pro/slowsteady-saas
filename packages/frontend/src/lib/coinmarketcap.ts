import axios from 'axios';

const CMC_API_KEY = import.meta.env.VITE_COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';

const cmcApi = axios.create({
  baseURL: CMC_BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
    'Accept': 'application/json',
  },
});

export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  last_updated: string;
  date_added: string;
  tags: string[];
  platform: any;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

export interface GlobalMetrics {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  total_exchanges: number;
  eth_dominance: number;
  btc_dominance: number;
  defi_volume_24h: number;
  defi_market_cap: number;
  derivatives_volume_24h: number;
  stablecoin_volume_24h: number;
  stablecoin_market_cap: number;
  total_market_cap: number;
  total_volume_24h: number;
  last_updated: string;
}

/**
 * Get latest cryptocurrency listings
 * @param limit - Number of results (default: 100, max: 5000)
 * @param start - Starting rank (default: 1)
 * @param convert - Currency to convert to (default: USD)
 * @returns List of cryptocurrencies with market data
 */
export async function getLatestListings(
  limit: number = 100,
  start: number = 1,
  convert: string = 'USD'
): Promise<CryptoCurrency[]> {
  try {
    const response = await cmcApi.get('/v1/cryptocurrency/listings/latest', {
      params: { start, limit, convert },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching latest listings:', error);
    throw new Error('Failed to fetch cryptocurrency listings');
  }
}

/**
 * Get trending cryptocurrencies
 * @param limit - Number of results (default: 10)
 * @returns List of trending cryptocurrencies
 */
export async function getTrending(limit: number = 10): Promise<CryptoCurrency[]> {
  try {
    const response = await cmcApi.get('/v1/cryptocurrency/trending/latest', {
      params: { limit },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw new Error('Failed to fetch trending cryptocurrencies');
  }
}

/**
 * Get cryptocurrency quotes by symbol
 * @param symbols - Comma-separated list of symbols (e.g., 'BTC,ETH,USDT')
 * @param convert - Currency to convert to (default: USD)
 * @returns Cryptocurrency data with quotes
 */
export async function getQuotesBySymbol(
  symbols: string,
  convert: string = 'USD'
): Promise<Record<string, CryptoCurrency>> {
  try {
    const response = await cmcApi.get('/v2/cryptocurrency/quotes/latest', {
      params: { symbol: symbols, convert },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Failed to fetch cryptocurrency quotes');
  }
}

/**
 * Get cryptocurrency quotes by ID
 * @param ids - Comma-separated list of IDs (e.g., '1,1027,825')
 * @param convert - Currency to convert to (default: USD)
 * @returns Cryptocurrency data with quotes
 */
export async function getQuotesById(
  ids: string,
  convert: string = 'USD'
): Promise<Record<string, CryptoCurrency>> {
  try {
    const response = await cmcApi.get('/v2/cryptocurrency/quotes/latest', {
      params: { id: ids, convert },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching quotes by ID:', error);
    throw new Error('Failed to fetch cryptocurrency quotes');
  }
}

/**
 * Get global cryptocurrency market metrics
 * @param convert - Currency to convert to (default: USD)
 * @returns Global market metrics
 */
export async function getGlobalMetrics(convert: string = 'USD'): Promise<GlobalMetrics> {
  try {
    const response = await cmcApi.get('/v1/global-metrics/quotes/latest', {
      params: { convert },
    });
    return response.data.data.quote[convert];
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    throw new Error('Failed to fetch global metrics');
  }
}

/**
 * Get cryptocurrency metadata
 * @param symbols - Comma-separated list of symbols
 * @returns Metadata including logo, description, urls
 */
export async function getMetadata(symbols: string): Promise<any> {
  try {
    const response = await cmcApi.get('/v2/cryptocurrency/info', {
      params: { symbol: symbols },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw new Error('Failed to fetch cryptocurrency metadata');
  }
}

/**
 * Get top gainers and losers
 * @param limit - Number of results (default: 10)
 * @param convert - Currency to convert to (default: USD)
 * @returns Object with gainers and losers arrays
 */
export async function getGainersLosers(
  limit: number = 10,
  convert: string = 'USD'
): Promise<{ gainers: CryptoCurrency[]; losers: CryptoCurrency[] }> {
  try {
    const response = await cmcApi.get('/v1/cryptocurrency/trending/gainers-losers', {
      params: { limit, convert },
    });
    return {
      gainers: response.data.data.gainers || [],
      losers: response.data.data.losers || [],
    };
  } catch (error) {
    console.error('Error fetching gainers/losers:', error);
    throw new Error('Failed to fetch gainers and losers');
  }
}

/**
 * Search for cryptocurrencies
 * @param query - Search query
 * @returns Search results
 */
export async function searchCrypto(query: string): Promise<any[]> {
  try {
    const response = await cmcApi.get('/v1/cryptocurrency/map', {
      params: { symbol: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching crypto:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
}

/**
 * Get price performance stats
 * @param id - Cryptocurrency ID
 * @param timePeriod - Time period (7d, 30d, 90d, 365d, all)
 * @returns Price performance data
 */
export async function getPricePerformance(
  id: number,
  timePeriod: string = '7d'
): Promise<any> {
  try {
    const response = await cmcApi.get('/v1/cryptocurrency/price-performance-stats/latest', {
      params: { id, time_period: timePeriod },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching price performance:', error);
    throw new Error('Failed to fetch price performance');
  }
}

/**
 * Format price with appropriate decimals
 * @param price - Price value
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(8)}`;
  }
}

/**
 * Format market cap
 * @param marketCap - Market cap value
 * @returns Formatted market cap string
 */
export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
}

/**
 * Format percentage change with color indicator
 * @param change - Percentage change value
 * @returns Object with formatted value and color class
 */
export function formatPercentChange(change: number): { value: string; color: string } {
  const isPositive = change >= 0;
  return {
    value: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
    color: isPositive ? 'text-green-500' : 'text-red-500',
  };
}

/**
 * Get popular cryptocurrencies (BTC, ETH, BNB, etc.)
 * @returns Top cryptocurrencies by market cap
 */
export async function getPopularCryptos(): Promise<CryptoCurrency[]> {
  return getLatestListings(20, 1);
}

/**
 * Get specific crypto price
 * @param symbol - Cryptocurrency symbol (e.g., 'BTC')
 * @returns Price in USD
 */
export async function getCryptoPrice(symbol: string): Promise<number> {
  try {
    const quotes = await getQuotesBySymbol(symbol);
    return quotes[symbol]?.quote.USD.price || 0;
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    return 0;
  }
}
