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

export default router;
