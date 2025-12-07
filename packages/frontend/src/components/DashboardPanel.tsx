import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuotesBySymbol, formatPrice, formatPercentChange } from '../lib/coinmarketcap';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export function DashboardPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const quotes = await getQuotesBySymbol('BTC,ETH,BNB');
      const prices: CryptoPrice[] = Object.values(quotes).map((crypto: any) => ({
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
      }));
      setCryptoPrices(prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📝', label: 'My Contracts', path: '/contracts' },
    { icon: '💳', label: 'Payments', path: '/payments' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '💧', label: 'Faucets', path: '/faucets' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '👥', label: 'Team', path: '/team' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
    { icon: '📚', label: 'Documentation', path: '/docs' },
    { icon: '💬', label: 'Support', path: '/support' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' },
    { icon: '🔐', label: 'Security', path: '/security' },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(-240px)',
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Hover trigger area */}
      <div className="absolute left-0 top-0 w-2 h-full" />
      
      {/* Panel */}
      <div className="w-64 h-full bg-midnight-violet border-r-2 border-gold shadow-2xl overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gold mb-6">Dashboard</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-frosted-mint hover:bg-clay-soil transition-all duration-200 group"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium group-hover:text-gold transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-shadow-grey rounded-lg border border-faded-copper">
            <p className="text-xs text-frosted-mint mb-2">Quick Stats</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-frosted-mint">Active Contracts</span>
                <span className="text-gold font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-frosted-mint">Total Spent</span>
                <span className="text-gold font-semibold">$48,500</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-shadow-grey rounded-lg border border-gold">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gold font-semibold">💰 Live Crypto Prices</p>
              <Link to="/crypto-tracker" className="text-xs text-faded-copper hover:text-gold transition-colors">
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="text-center text-frosted-mint text-xs py-2">Loading...</div>
            ) : (
              <div className="space-y-2">
                {cryptoPrices.map((crypto) => {
                  const changeData = formatPercentChange(crypto.change24h);
                  return (
                    <div key={crypto.symbol} className="flex justify-between items-center text-xs">
                      <span className="text-frosted-mint font-semibold">{crypto.symbol}</span>
                      <div className="text-right">
                        <div className="text-gold">{formatPrice(crypto.price)}</div>
                        <div className={changeData.color}>{changeData.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
