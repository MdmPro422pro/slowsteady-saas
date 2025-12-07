import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';
import {
  getLatestListings,
  getGlobalMetrics,
  getTrending,
  getGainersLosers,
  formatPrice,
  formatMarketCap,
  formatPercentChange,
} from '../lib/coinmarketcap';

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
}

interface GlobalMetrics {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeCryptocurrencies: number;
}

export default function CryptoTrackerPage() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);
  const [trending, setTrending] = useState<CryptoData[]>([]);
  const [gainers, setGainers] = useState<CryptoData[]>([]);
  const [losers, setLosers] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'trending' | 'gainers' | 'losers'>('all');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch multiple datasets in parallel
      const [listingsData, metricsData, trendingData, gainersLosersData] = await Promise.all([
        getLatestListings(100),
        getGlobalMetrics(),
        getTrending(10),
        getGainersLosers(5),
      ]);

      // Process listings
      const cryptoData = listingsData.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
        change7d: crypto.quote.USD.percent_change_7d,
        marketCap: crypto.quote.USD.market_cap,
        volume24h: crypto.quote.USD.volume_24h,
        circulatingSupply: crypto.circulating_supply,
      }));
      setCryptos(cryptoData);

      // Process global metrics
      setGlobalMetrics({
        totalMarketCap: metricsData.total_market_cap,
        totalVolume24h: metricsData.total_volume_24h,
        btcDominance: metricsData.btc_dominance,
        activeCryptocurrencies: metricsData.active_cryptocurrencies,
      });

      // Process trending
      const trendingData2 = trendingData.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
        change7d: crypto.quote.USD.percent_change_7d,
        marketCap: crypto.quote.USD.market_cap,
        volume24h: crypto.quote.USD.volume_24h,
        circulatingSupply: crypto.circulating_supply,
      }));
      setTrending(trendingData2);

      // Process gainers and losers
      const gainersData = gainersLosersData.gainers.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
        change7d: crypto.quote.USD.percent_change_7d,
        marketCap: crypto.quote.USD.market_cap,
        volume24h: crypto.quote.USD.volume_24h,
        circulatingSupply: crypto.circulating_supply,
      }));
      setGainers(gainersData);

      const losersData = gainersLosersData.losers.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change24h: crypto.quote.USD.percent_change_24h,
        change7d: crypto.quote.USD.percent_change_7d,
        marketCap: crypto.quote.USD.market_cap,
        volume24h: crypto.quote.USD.volume_24h,
        circulatingSupply: crypto.circulating_supply,
      }));
      setLosers(losersData);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayData = () => {
    switch (selectedTab) {
      case 'trending':
        return trending;
      case 'gainers':
        return gainers;
      case 'losers':
        return losers;
      default:
        return cryptos;
    }
  };

  const filteredCryptos = getDisplayData().filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />

      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-clay-soil">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gold">
            MDMPro <span className="text-frosted-mint">Crypto Tracker</span>
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Metrics */}
        {globalMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-6">
              <p className="text-faded-copper text-sm mb-2">Total Market Cap</p>
              <p className="text-2xl font-bold text-gold">{formatMarketCap(globalMetrics.totalMarketCap)}</p>
            </div>
            <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-6">
              <p className="text-faded-copper text-sm mb-2">24h Volume</p>
              <p className="text-2xl font-bold text-gold">{formatMarketCap(globalMetrics.totalVolume24h)}</p>
            </div>
            <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-6">
              <p className="text-faded-copper text-sm mb-2">BTC Dominance</p>
              <p className="text-2xl font-bold text-gold">{globalMetrics.btcDominance.toFixed(2)}%</p>
            </div>
            <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-6">
              <p className="text-faded-copper text-sm mb-2">Active Cryptos</p>
              <p className="text-2xl font-bold text-gold">{globalMetrics.activeCryptocurrencies.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Search and Tabs */}
        <div className="bg-shadow-grey border-2 border-clay-soil rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedTab === 'all'
                    ? 'bg-gold text-midnight-violet'
                    : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil'
                }`}
              >
                All Cryptos
              </button>
              <button
                onClick={() => setSelectedTab('trending')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedTab === 'trending'
                    ? 'bg-gold text-midnight-violet'
                    : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil'
                }`}
              >
                🔥 Trending
              </button>
              <button
                onClick={() => setSelectedTab('gainers')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedTab === 'gainers'
                    ? 'bg-gold text-midnight-violet'
                    : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil'
                }`}
              >
                📈 Top Gainers
              </button>
              <button
                onClick={() => setSelectedTab('losers')}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  selectedTab === 'losers'
                    ? 'bg-gold text-midnight-violet'
                    : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil'
                }`}
              >
                📉 Top Losers
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-midnight-violet border-2 border-clay-soil rounded-lg text-frosted-mint placeholder-faded-copper focus:outline-none focus:border-gold w-full md:w-80"
            />
          </div>

          {/* Crypto Table */}
          {loading ? (
            <div className="text-center text-frosted-mint py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
              <p className="text-lg">Loading market data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-clay-soil">
                    <th className="text-left text-faded-copper font-bold py-3 px-2">#</th>
                    <th className="text-left text-faded-copper font-bold py-3 px-2">Name</th>
                    <th className="text-right text-faded-copper font-bold py-3 px-2">Price</th>
                    <th className="text-right text-faded-copper font-bold py-3 px-2">24h %</th>
                    <th className="text-right text-faded-copper font-bold py-3 px-2">7d %</th>
                    <th className="text-right text-faded-copper font-bold py-3 px-2">Market Cap</th>
                    <th className="text-right text-faded-copper font-bold py-3 px-2">Volume (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCryptos.map((crypto, index) => {
                    const change24 = formatPercentChange(crypto.change24h);
                    const change7d = formatPercentChange(crypto.change7d);
                    return (
                      <tr key={crypto.id} className="border-b border-clay-soil hover:bg-midnight-violet transition">
                        <td className="py-4 px-2 text-frosted-mint">{index + 1}</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-bold">{crypto.symbol}</span>
                            <span className="text-frosted-mint text-sm">{crypto.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right text-frosted-mint font-bold">
                          {formatPrice(crypto.price)}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span
                            className={`font-bold ${change24.color === 'green' ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {change24.value}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span
                            className={`font-bold ${change7d.color === 'green' ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {change7d.value}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right text-frosted-mint">
                          {formatMarketCap(crypto.marketCap)}
                        </td>
                        <td className="py-4 px-2 text-right text-frosted-mint">
                          {formatMarketCap(crypto.volume24h)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredCryptos.length === 0 && (
                <div className="text-center text-frosted-mint py-12">
                  <p className="text-lg">No cryptocurrencies found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-faded-copper">
            Data updates every 2 minutes • Powered by CoinMarketCap
          </div>
        </div>
      </main>
    </div>
  );
}
