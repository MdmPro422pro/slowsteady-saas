import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth';
import * as binance from '../lib/binance';

const router = Router();

// SECURITY: Strict rate limiting for trading endpoints
const tradingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 trades per minute
  message: 'Too many trade requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// SECURITY: All trading routes require authentication
router.use(authenticate);
router.use(tradingLimiter);

// Get account balance
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const balance = await binance.getAccountBalance();
    res.json(balance);
  } catch (error: any) {
    console.error('Balance fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get current price for a symbol
router.get('/price/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    // SECURITY: Validate symbol format
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    const price = await binance.getPrice(symbol);
    res.json(price);
  } catch (error: any) {
    console.error('Price fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// Get 24hr stats
router.get('/stats/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    const stats = await binance.get24hrStats(symbol);
    res.json(stats);
  } catch (error: any) {
    console.error('Stats fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Place market order
router.post('/order/market', async (req: Request, res: Response) => {
  try {
    const { symbol, side, quantity } = req.body;
    
    // SECURITY: Validate inputs
    if (!symbol || !side || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    if (!['BUY', 'SELL'].includes(side)) {
      return res.status(400).json({ error: 'Side must be BUY or SELL' });
    }
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const result = await binance.placeMarketOrder({ symbol, side, quantity });
    res.json(result);
  } catch (error: any) {
    console.error('Market order error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to place market order' });
  }
});

// Place limit order
router.post('/order/limit', async (req: Request, res: Response) => {
  try {
    const { symbol, side, quantity, price } = req.body;
    
    // SECURITY: Validate inputs
    if (!symbol || !side || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    if (!['BUY', 'SELL'].includes(side)) {
      return res.status(400).json({ error: 'Side must be BUY or SELL' });
    }
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    
    const result = await binance.placeLimitOrder({ symbol, side, quantity, price });
    res.json(result);
  } catch (error: any) {
    console.error('Limit order error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to place limit order' });
  }
});

// Cancel order
router.delete('/order/:symbol/:orderId', async (req: Request, res: Response) => {
  try {
    const { symbol, orderId } = req.params;
    
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    const result = await binance.cancelOrder(symbol, orderIdNum);
    res.json(result);
  } catch (error: any) {
    console.error('Cancel order error:', error.message);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get order history
router.get('/orders/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    if (!/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    if (limit < 1 || limit > 1000) {
      return res.status(400).json({ error: 'Limit must be between 1 and 1000' });
    }
    
    const orders = await binance.getOrderHistory(symbol, limit);
    res.json(orders);
  } catch (error: any) {
    console.error('Order history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// Get open orders
router.get('/orders/open', async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string | undefined;
    
    if (symbol && !/^[A-Z]{6,10}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid trading pair symbol' });
    }
    
    const orders = await binance.getOpenOrders(symbol);
    res.json(orders);
  } catch (error: any) {
    console.error('Open orders error:', error.message);
    res.status(500).json({ error: 'Failed to fetch open orders' });
  }
});

// Get deposit address
router.get('/deposit/address/:coin', async (req: Request, res: Response) => {
  try {
    const { coin } = req.params;
    const network = req.query.network as string | undefined;
    
    // SECURITY: Validate coin format
    if (!/^[A-Z]{2,10}$/.test(coin)) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }
    
    if (network && !/^[A-Z0-9]{2,20}$/.test(network)) {
      return res.status(400).json({ error: 'Invalid network' });
    }
    
    const address = await binance.getDepositAddress(coin, network);
    res.json(address);
  } catch (error: any) {
    console.error('Deposit address error:', error.message);
    res.status(500).json({ error: 'Failed to get deposit address' });
  }
});

// Get deposit history
router.get('/deposit/history', async (req: Request, res: Response) => {
  try {
    const coin = req.query.coin as string | undefined;
    const status = req.query.status ? parseInt(req.query.status as string) : undefined;
    
    if (coin && !/^[A-Z]{2,10}$/.test(coin)) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }
    
    const history = await binance.getDepositHistory(coin, status);
    res.json(history);
  } catch (error: any) {
    console.error('Deposit history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch deposit history' });
  }
});

// Withdraw crypto
router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const { coin, address, amount, network } = req.body;
    
    // SECURITY: Strict validation for withdrawals
    if (!coin || !address || !amount) {
      return res.status(400).json({ error: 'Missing required fields: coin, address, amount' });
    }
    
    if (!/^[A-Z]{2,10}$/.test(coin)) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // SECURITY: Basic address validation (expand based on coin type)
    if (typeof address !== 'string' || address.length < 26 || address.length > 120) {
      return res.status(400).json({ error: 'Invalid withdrawal address' });
    }
    
    if (network && !/^[A-Z0-9]{2,20}$/.test(network)) {
      return res.status(400).json({ error: 'Invalid network' });
    }
    
    // IMPORTANT: Log withdrawal attempts for security monitoring
    console.log(`WITHDRAWAL REQUEST: User ${req.user?.userId} withdrawing ${amount} ${coin} to ${address}`);
    
    const result = await binance.withdrawCrypto(coin, address, amount, network);
    res.json(result);
  } catch (error: any) {
    console.error('Withdrawal error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process withdrawal' });
  }
});

// Get withdrawal history
router.get('/withdraw/history', async (req: Request, res: Response) => {
  try {
    const coin = req.query.coin as string | undefined;
    const status = req.query.status ? parseInt(req.query.status as string) : undefined;
    
    if (coin && !/^[A-Z]{2,10}$/.test(coin)) {
      return res.status(400).json({ error: 'Invalid coin symbol' });
    }
    
    const history = await binance.getWithdrawalHistory(coin, status);
    res.json(history);
  } catch (error: any) {
    console.error('Withdrawal history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch withdrawal history' });
  }
});

// Get coin info (networks, fees, limits)
router.get('/coins/info', async (req: Request, res: Response) => {
  try {
    const info = await binance.getCoinInfo();
    res.json(info);
  } catch (error: any) {
    console.error('Coin info error:', error.message);
    res.status(500).json({ error: 'Failed to fetch coin information' });
  }
});

export default router;
