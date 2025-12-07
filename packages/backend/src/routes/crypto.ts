import express from 'express';
import axios from 'axios';

const router = express.Router();

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';

const cmcApi = axios.create({
  baseURL: CMC_BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
    'Accept': 'application/json',
  },
});

// Get latest cryptocurrency listings
router.get('/listings', async (req, res) => {
  try {
    const { limit = 100, convert = 'USD' } = req.query;
    const response = await cmcApi.get('/v1/cryptocurrency/listings/latest', {
      params: { limit, convert },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('CMC API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch cryptocurrency listings',
      details: error.response?.data || error.message,
    });
  }
});

// Get global metrics
router.get('/global-metrics', async (req, res) => {
  try {
    const { convert = 'USD' } = req.query;
    const response = await cmcApi.get('/v1/global-metrics/quotes/latest', {
      params: { convert },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('CMC API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch global metrics',
      details: error.response?.data || error.message,
    });
  }
});

// Get quotes by symbol
router.get('/quotes', async (req, res) => {
  try {
    const { symbol, convert = 'USD' } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    const response = await cmcApi.get('/v2/cryptocurrency/quotes/latest', {
      params: { symbol, convert },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('CMC API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch quotes',
      details: error.response?.data || error.message,
    });
  }
});

// Get trending cryptocurrencies
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const response = await cmcApi.get('/v1/cryptocurrency/trending/latest', {
      params: { limit },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('CMC API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch trending cryptocurrencies',
      details: error.response?.data || error.message,
    });
  }
});

// Get gainers and losers
router.get('/gainers-losers', async (req, res) => {
  try {
    const { limit = 10, convert = 'USD' } = req.query;
    const response = await cmcApi.get('/v1/cryptocurrency/trending/gainers-losers', {
      params: { limit, convert },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('CMC API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch gainers and losers',
      details: error.response?.data || error.message,
    });
  }
});

export default router;
