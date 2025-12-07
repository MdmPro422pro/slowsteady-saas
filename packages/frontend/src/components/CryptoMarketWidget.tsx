import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestListings, formatPrice, formatPercentChange } from '../lib/coinmarketcap';

interface CryptoData {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export default function CryptoMarketWidget() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        setLoading(true);
        const listings = await getLatestListings(8); // Get top 8
        const cryptoData = listings.map((crypto: any) => ({
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          price: crypto.quote.USD.price,
          change24h: crypto.quote.USD.percent_change_24h,
          marketCap: crypto.quote.USD.market_cap,
        }));
        setCryptos(cryptoData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCryptos();
    const interval = setInterval(fetchTopCryptos, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleViewAll = () => {
    navigate('/crypto-tracker');
  };

  return (
    <section className="bg-midnight-violet py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gold mb-2">📈 Live Crypto Market</h2>
            <p className="text-frosted-mint">Real-time cryptocurrency prices and market data</p>
          </div>
          <button
            onClick={handleViewAll}
            className="px-6 py-2 bg-gold text-midnight-violet font-bold rounded-lg hover:bg-clay-soil transition"
          >
            View Full Tracker →
          </button>
        </div>

        {loading ? (
          <div className="text-center text-frosted-mint py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
            <p className="mt-4">Loading market data...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cryptos.map((crypto) => {
              const changeFormatted = formatPercentChange(crypto.change24h);
              return (
                <div
                  key={crypto.id}
                  className="bg-shadow-grey p-4 rounded-lg border border-clay-soil hover:border-gold transition cursor-pointer"
                  onClick={handleViewAll}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gold">{crypto.symbol}</h3>
                      <p className="text-sm text-frosted-mint opacity-75">{crypto.name}</p>
                    </div>
                    <span
                      className={`text-sm font-bold px-2 py-1 rounded ${
                        crypto.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {changeFormatted.value}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-frosted-mint mt-2">{formatPrice(crypto.price)}</p>
                  <p className="text-xs text-frosted-mint opacity-50 mt-1">
                    MCap: ${(crypto.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-frosted-mint opacity-75">
          Data updates every 2 minutes • Powered by CoinMarketCap
        </div>
      </div>
    </section>
  );
}
