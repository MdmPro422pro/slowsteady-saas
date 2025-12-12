import { Spot } from '@binance/connector';

const apiKey = process.env.BINANCE_API_KEY || '';
const apiSecret = process.env.BINANCE_API_SECRET || '';
const isTestnet = process.env.BINANCE_TESTNET === 'true';
const useBinanceUS = process.env.BINANCE_US === 'true';

// Initialize Binance client
let baseURL: string;
if (isTestnet) {
  baseURL = 'https://testnet.binance.vision';
} else if (useBinanceUS) {
  baseURL = 'https://api.binance.us';
} else {
  baseURL = 'https://api.binance.com';
}

export const binanceClient = new Spot(apiKey, apiSecret, { baseURL });

/**
 * SECURITY NOTE: Never expose these functions directly to frontend.
 * All trading operations MUST go through authenticated backend endpoints.
 */

export interface TradeParams {
  symbol: string;      // e.g., 'BTCUSDT'
  side: 'BUY' | 'SELL';
  quantity: number;    // Amount to trade
  price?: number;      // Limit order price (optional)
}

export interface OrderResult {
  orderId: number;
  symbol: string;
  side: string;
  price: string;
  quantity: string;
  status: string;
  timestamp: number;
}

/**
 * Get account balance
 */
export async function getAccountBalance() {
  try {
    const response = await binanceClient.account();
    return response.data;
  } catch (error: any) {
    console.error('Binance account error:', error.response?.data || error.message);
    throw new Error('Failed to fetch account balance');
  }
}

/**
 * Get current price for a trading pair
 */
export async function getPrice(symbol: string) {
  try {
    const response = await binanceClient.tickerPrice(symbol);
    return response.data;
  } catch (error: any) {
    console.error('Binance price error:', error.response?.data || error.message);
    throw new Error(`Failed to get price for ${symbol}`);
  }
}

/**
 * Place a market order (instant execution at current price)
 */
export async function placeMarketOrder(params: TradeParams): Promise<OrderResult> {
  try {
    const { symbol, side, quantity } = params;
    
    const response = await binanceClient.newOrder(symbol, side, 'MARKET', {
      quantity: quantity.toString(),
    });
    
    return {
      orderId: response.data.orderId,
      symbol: response.data.symbol,
      side: response.data.side,
      price: response.data.fills?.[0]?.price || '0',
      quantity: response.data.executedQty,
      status: response.data.status,
      timestamp: response.data.transactTime,
    };
  } catch (error: any) {
    console.error('Binance market order error:', error.response?.data || error.message);
    throw new Error(`Failed to place ${params.side} order for ${params.symbol}`);
  }
}

/**
 * Place a limit order (execute at specific price)
 */
export async function placeLimitOrder(params: TradeParams): Promise<OrderResult> {
  try {
    const { symbol, side, quantity, price } = params;
    
    if (!price) {
      throw new Error('Price is required for limit orders');
    }
    
    const response = await binanceClient.newOrder(symbol, side, 'LIMIT', {
      quantity: quantity.toString(),
      price: price.toString(),
      timeInForce: 'GTC', // Good Till Cancelled
    });
    
    return {
      orderId: response.data.orderId,
      symbol: response.data.symbol,
      side: response.data.side,
      price: response.data.price,
      quantity: response.data.origQty,
      status: response.data.status,
      timestamp: response.data.transactTime,
    };
  } catch (error: any) {
    console.error('Binance limit order error:', error.response?.data || error.message);
    throw new Error(`Failed to place limit order for ${params.symbol}`);
  }
}

/**
 * Cancel an open order
 */
export async function cancelOrder(symbol: string, orderId: number) {
  try {
    const response = await binanceClient.cancelOrder(symbol, { orderId });
    return response.data;
  } catch (error: any) {
    console.error('Binance cancel order error:', error.response?.data || error.message);
    throw new Error(`Failed to cancel order ${orderId}`);
  }
}

/**
 * Get order history
 */
export async function getOrderHistory(symbol: string, limit: number = 50) {
  try {
    const response = await binanceClient.allOrders(symbol, { limit });
    return response.data;
  } catch (error: any) {
    console.error('Binance order history error:', error.response?.data || error.message);
    throw new Error(`Failed to get order history for ${symbol}`);
  }
}

/**
 * Get open orders
 */
export async function getOpenOrders(symbol?: string) {
  try {
    const params = symbol ? { symbol } : undefined;
    const response = await binanceClient.openOrders(params);
    return response.data;
  } catch (error: any) {
    console.error('Binance open orders error:', error.response?.data || error.message);
    throw new Error('Failed to get open orders');
  }
}

/**
 * Get 24hr ticker stats
 */
export async function get24hrStats(symbol: string) {
  try {
    const response = await binanceClient.ticker24hr(symbol);
    return response.data;
  } catch (error: any) {
    console.error('Binance 24hr stats error:', error.response?.data || error.message);
    throw new Error(`Failed to get 24hr stats for ${symbol}`);
  }
}

/**
 * Get deposit address for a coin
 */
export async function getDepositAddress(coin: string, network?: string) {
  try {
    const params: any = { coin };
    if (network) {
      params.network = network;
    }
    const response = await binanceClient.depositAddress(params);
    return response.data;
  } catch (error: any) {
    console.error('Binance deposit address error:', error.response?.data || error.message);
    throw new Error(`Failed to get deposit address for ${coin}`);
  }
}

/**
 * Get deposit history
 */
export async function getDepositHistory(coin?: string, status?: number) {
  try {
    const params: any = {};
    if (coin) params.coin = coin;
    if (status !== undefined) params.status = status;
    
    const response = await binanceClient.depositHistory(params);
    return response.data;
  } catch (error: any) {
    console.error('Binance deposit history error:', error.response?.data || error.message);
    throw new Error('Failed to get deposit history');
  }
}

/**
 * Withdraw crypto (REQUIRES IP WHITELIST AND WITHDRAWAL ENABLED ON API KEY)
 */
export async function withdrawCrypto(coin: string, address: string, amount: number, network?: string) {
  try {
    const params: any = {
      coin,
      address,
      amount: amount.toString(),
    };
    
    if (network) {
      params.network = network;
    }
    
    const response = await binanceClient.withdraw(params);
    return response.data;
  } catch (error: any) {
    console.error('Binance withdrawal error:', error.response?.data || error.message);
    throw new Error(`Failed to withdraw ${coin}: ${error.response?.data?.msg || error.message}`);
  }
}

/**
 * Get withdrawal history
 */
export async function getWithdrawalHistory(coin?: string, status?: number) {
  try {
    const params: any = {};
    if (coin) params.coin = coin;
    if (status !== undefined) params.status = status;
    
    const response = await binanceClient.withdrawHistory(params);
    return response.data;
  } catch (error: any) {
    console.error('Binance withdrawal history error:', error.response?.data || error.message);
    throw new Error('Failed to get withdrawal history');
  }
}

/**
 * Get coin information (networks, fees, etc)
 */
export async function getCoinInfo() {
  try {
    const response = await binanceClient.capitalConfigGetall();
    return response.data;
  } catch (error: any) {
    console.error('Binance coin info error:', error.response?.data || error.message);
    throw new Error('Failed to get coin information');
  }
}
