import { useState, useEffect } from 'react';
import { DashboardPanel } from '../components/DashboardPanel';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../lib/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface PriceData {
  symbol: string;
  price: string;
}

interface OrderForm {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: string;
  price: string;
}

export default function TradingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'spot' | 'orders' | 'withdraw'>('spot');
  const [balance, setBalance] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState<PriceData | null>(null);
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [orderForm, setOrderForm] = useState<OrderForm>({
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    quantity: '',
    price: '',
  });

  const [withdrawForm, setWithdrawForm] = useState({
    coin: 'BTC',
    address: '',
    amount: '',
    network: '',
  });

  useEffect(() => {
    if (user) {
      loadBalance();
      loadPrice();
      loadOpenOrders();
    }
  }, [user]);

  useEffect(() => {
    // Refresh price every 5 seconds
    const interval = setInterval(() => {
      if (orderForm.symbol) {
        loadPrice();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderForm.symbol]);

  const loadBalance = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/trading/balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const loadPrice = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/trading/price/${orderForm.symbol}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPrice(data);
      }
    } catch (error) {
      console.error('Error loading price:', error);
    }
  };

  const loadOpenOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/trading/orders/open`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOpenOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      toast.error('Please log in to trade');
      return;
    }

    if (!orderForm.quantity || parseFloat(orderForm.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (orderForm.type === 'LIMIT' && (!orderForm.price || parseFloat(orderForm.price) <= 0)) {
      toast.error('Please enter a valid price for limit order');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please log in to trade');
        return;
      }

      const endpoint = orderForm.type === 'MARKET' 
        ? '/api/trading/order/market'
        : '/api/trading/order/limit';

      const body: any = {
        symbol: orderForm.symbol,
        side: orderForm.side,
        quantity: parseFloat(orderForm.quantity),
      };

      if (orderForm.type === 'LIMIT') {
        body.price = parseFloat(orderForm.price);
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Order placed successfully! Order ID: ${result.orderId}`);
        setOrderForm({ ...orderForm, quantity: '', price: '' });
        loadBalance();
        loadOpenOrders();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (symbol: string, orderId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/trading/order/${symbol}/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Order cancelled successfully');
        loadOpenOrders();
        loadBalance();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel order');
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id) {
      toast.error('Please log in to withdraw');
      return;
    }

    if (!withdrawForm.address || !withdrawForm.amount || !withdrawForm.coin) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(withdrawForm.amount) <= 0) {
      toast.error('Invalid withdrawal amount');
      return;
    }

    if (!confirm(`⚠️ Are you sure you want to withdraw ${withdrawForm.amount} ${withdrawForm.coin} to ${withdrawForm.address}?\n\nThis action CANNOT be undone!`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please log in to withdraw');
        return;
      }

      const response = await fetch(`${API_URL}/api/trading/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          coin: withdrawForm.coin,
          address: withdrawForm.address,
          amount: parseFloat(withdrawForm.amount),
          network: withdrawForm.network || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Withdrawal initiated! ID: ${result.id}`);
        setWithdrawForm({ coin: 'BTC', address: '', amount: '', network: '' });
        loadBalance();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to process withdrawal');
      }
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast.error('Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const getTotalValue = () => {
    if (!balance || !currentPrice) return '0.00';
    const btcBalance = balance.balances?.find((b: any) => b.asset === 'BTC')?.free || 0;
    return (parseFloat(btcBalance) * parseFloat(currentPrice.price)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gold">Trading</h1>
          <div className="text-right">
            <div className="text-frosted-mint text-sm">Total Portfolio Value</div>
            <div className="text-3xl font-bold text-gold">${getTotalValue()}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('spot')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'spot'
                ? 'bg-gold text-midnight-violet'
                : 'bg-shadow-grey text-frosted-mint hover:bg-clay-soil'
            }`}
          >
            📊 Spot Trading
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-gold text-midnight-violet'
                : 'bg-shadow-grey text-frosted-mint hover:bg-clay-soil'
            }`}
          >
            📝 Open Orders {openOrders.length > 0 && `(${openOrders.length})`}
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'withdraw'
                ? 'bg-gold text-midnight-violet'
                : 'bg-shadow-grey text-frosted-mint hover:bg-clay-soil'
            }`}
          >
            💸 Withdraw
          </button>
        </div>

        {activeTab === 'spot' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Trading Form */}
            <div className="lg:col-span-2">
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h2 className="text-2xl font-bold text-gold mb-6">Place Order</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Trading Pair</label>
                    <select
                      value={orderForm.symbol}
                      onChange={(e) => setOrderForm({ ...orderForm, symbol: e.target.value })}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="BTCUSDT">BTC/USDT</option>
                      <option value="ETHUSDT">ETH/USDT</option>
                      <option value="BNBUSDT">BNB/USDT</option>
                      <option value="ADAUSDT">ADA/USDT</option>
                      <option value="SOLUSDT">SOL/USDT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-frosted-mint mb-2 font-semibold">Order Type</label>
                    <select
                      value={orderForm.type}
                      onChange={(e) => setOrderForm({ ...orderForm, type: e.target.value as 'MARKET' | 'LIMIT' })}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    >
                      <option value="MARKET">Market</option>
                      <option value="LIMIT">Limit</option>
                    </select>
                  </div>
                </div>

                {currentPrice && (
                  <div className="mb-6 p-4 bg-midnight-violet rounded-lg border border-gold">
                    <div className="text-frosted-mint text-sm mb-1">Current Price</div>
                    <div className="text-3xl font-bold text-gold">
                      ${parseFloat(currentPrice.price).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setOrderForm({ ...orderForm, side: 'BUY' })}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      orderForm.side === 'BUY'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setOrderForm({ ...orderForm, side: 'SELL' })}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      orderForm.side === 'SELL'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {orderForm.type === 'LIMIT' && (
                  <div className="mb-4">
                    <label className="block text-frosted-mint mb-2 font-semibold">Price (USDT)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-frosted-mint mb-2 font-semibold">Quantity</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                    placeholder="0.0000"
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                    orderForm.side === 'BUY'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Placing Order...' : `${orderForm.side} ${orderForm.symbol.replace('USDT', '')}`}
                </button>
              </div>
            </div>

            {/* Account Balance */}
            <div>
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper mb-6">
                <h3 className="text-xl font-bold text-gold mb-4">Account Balance</h3>
                {balance ? (
                  <div className="space-y-3">
                    {balance.balances?.filter((b: any) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0).slice(0, 5).map((b: any) => (
                      <div key={b.asset} className="flex justify-between items-center">
                        <span className="text-frosted-mint font-semibold">{b.asset}</span>
                        <span className="text-gold">{parseFloat(b.free).toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-frosted-mint">Loading balance...</p>
                )}
              </div>

              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h3 className="text-xl font-bold text-gold mb-4">⚠️ Risk Warning</h3>
                <p className="text-frosted-mint text-sm leading-relaxed">
                  Trading cryptocurrencies involves substantial risk of loss. Only trade with funds you can afford to lose. This is {process.env.VITE_BINANCE_TESTNET === 'true' ? 'TESTNET' : 'LIVE TRADING'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
            <h2 className="text-2xl font-bold text-gold mb-6">Open Orders</h2>
            {openOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-faded-copper">
                      <th className="text-left py-3 px-4 text-frosted-mint">Symbol</th>
                      <th className="text-left py-3 px-4 text-frosted-mint">Type</th>
                      <th className="text-left py-3 px-4 text-frosted-mint">Side</th>
                      <th className="text-right py-3 px-4 text-frosted-mint">Price</th>
                      <th className="text-right py-3 px-4 text-frosted-mint">Quantity</th>
                      <th className="text-right py-3 px-4 text-frosted-mint">Status</th>
                      <th className="text-right py-3 px-4 text-frosted-mint">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openOrders.map((order) => (
                      <tr key={order.orderId} className="border-b border-gray-700 hover:bg-midnight-violet">
                        <td className="py-3 px-4 text-gold font-semibold">{order.symbol}</td>
                        <td className="py-3 px-4 text-frosted-mint">{order.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded ${order.side === 'BUY' ? 'bg-green-600' : 'bg-red-600'} text-white text-sm`}>
                            {order.side}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-frosted-mint">{parseFloat(order.price).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-frosted-mint">{parseFloat(order.origQty).toFixed(4)}</td>
                        <td className="py-3 px-4 text-right text-frosted-mint">{order.status}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleCancelOrder(order.symbol, order.orderId)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-frosted-mint text-center py-8">No open orders</p>
            )}
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Withdrawal Form */}
            <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
              <h2 className="text-2xl font-bold text-gold mb-6">💸 Withdraw Crypto</h2>
              
              <div className="mb-4">
                <label className="block text-frosted-mint mb-2 font-semibold">Coin</label>
                <select
                  value={withdrawForm.coin}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, coin: e.target.value })}
                  className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">Binance Coin (BNB)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="DOT">Polkadot (DOT)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-frosted-mint mb-2 font-semibold">Network (Optional)</label>
                <input
                  type="text"
                  value={withdrawForm.network}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, network: e.target.value })}
                  className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                  placeholder="e.g., BTC, ETH, BSC, TRC20"
                />
                <p className="text-frosted-mint text-xs mt-1">Leave empty for default network</p>
              </div>

              <div className="mb-4">
                <label className="block text-frosted-mint mb-2 font-semibold">Withdrawal Address</label>
                <input
                  type="text"
                  value={withdrawForm.address}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, address: e.target.value })}
                  className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold font-mono text-sm"
                  placeholder="Enter destination address"
                />
              </div>

              <div className="mb-6">
                <label className="block text-frosted-mint mb-2 font-semibold">Amount</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-midnight-violet border border-faded-copper rounded-lg text-frosted-mint focus:outline-none focus:border-gold"
                  placeholder="0.00000000"
                />
              </div>

              <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div>
                    <div className="text-red-500 font-bold mb-1">IMPORTANT WARNING</div>
                    <p className="text-frosted-mint text-sm">
                      Double-check the withdrawal address and network. Sending to wrong address or network will result in permanent loss of funds. Withdrawals CANNOT be reversed.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={loading}
                className={`w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </div>

            {/* Account Balance & Info */}
            <div>
              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper mb-6">
                <h3 className="text-xl font-bold text-gold mb-4">Available Balance</h3>
                {balance ? (
                  <div className="space-y-3">
                    {balance.balances?.filter((b: any) => parseFloat(b.free) > 0).slice(0, 8).map((b: any) => (
                      <div key={b.asset} className="flex justify-between items-center">
                        <span className="text-frosted-mint font-semibold">{b.asset}</span>
                        <span className="text-gold">{parseFloat(b.free).toFixed(8)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-frosted-mint">Loading balance...</p>
                )}
              </div>

              <div className="bg-shadow-grey p-6 rounded-lg border-2 border-faded-copper">
                <h3 className="text-xl font-bold text-gold mb-4">📋 Withdrawal Requirements</h3>
                <ul className="text-frosted-mint text-sm space-y-2 list-disc list-inside">
                  <li>Your Binance API key must have withdrawal permissions enabled</li>
                  <li>Your IP address must be whitelisted in Binance</li>
                  <li>Verify the withdrawal address carefully before confirming</li>
                  <li>Check network fees before withdrawing</li>
                  <li>Minimum withdrawal amounts apply per coin</li>
                  <li>Withdrawals may take 10-30 minutes to process</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
