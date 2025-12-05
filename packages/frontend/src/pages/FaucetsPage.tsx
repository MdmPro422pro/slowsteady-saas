import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';

export default function FaucetsPage() {
  const faucets = [
    {
      name: 'SolPick',
      description: 'Earn Solana tokens through daily claims and rewards',
      url: 'https://solpick.io/?ref=handleton',
      icon: '💧'
    },
    {
      name: 'SuiPick',
      description: 'Claim free Sui tokens daily',
      url: 'https://suipick.io/?ref=handleton',
      icon: '🚰'
    },
    {
      name: 'BNBPick',
      description: 'Get free BNB tokens and rewards',
      url: 'https://bnbpick.io/?ref=handleton',
      icon: '💰'
    },
    {
      name: 'LitePick',
      description: 'Earn Litecoin through daily faucet claims',
      url: 'https://litepick.io/?ref=handleton',
      icon: '⚡'
    },
    {
      name: 'TronPick',
      description: 'Claim free Tron tokens and rewards',
      url: 'https://tronpick.io/?ref=handleton',
      icon: '🎯'
    },
    {
      name: 'PolPick',
      description: 'Get free Polkadot tokens daily',
      url: 'https://polpick.io/?ref=handleton',
      icon: '🔷'
    },
    {
      name: 'TonPick',
      description: 'Earn TON tokens through daily claims',
      url: 'https://tonpick.game/?ref=handleton',
      icon: '💎'
    },
    {
      name: 'DogePick',
      description: 'Claim free Dogecoin rewards daily',
      url: 'https://dogepick.io/?ref=handleton',
      icon: '🐕'
    },
    {
      name: 'Bitcoin Aliens',
      description: 'Play games and earn free Bitcoin rewards',
      url: 'https://bitcoinaliens.com/?ref=5761100&game=7&pf=2',
      icon: '👽'
    },
    {
      name: 'Bitcoin Aliens 2',
      description: 'More games to earn free Bitcoin',
      url: 'https://bitcoinaliens.com/?ref=5761100&game=8&pf=2',
      icon: '🎮'
    }
  ];

  const renderFaucetTiles = (count: number) => {
    return Array.from({ length: count }, (_, idx) => {
      const faucet = faucets[idx];
      
      if (faucet) {
        return (
          <a
            key={`faucet-${idx}`}
            href={faucet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col cursor-pointer"
          >
            <div className="relative w-full h-48 bg-shadow-grey overflow-hidden flex items-center justify-center">
              <div className="text-6xl text-faded-copper">{faucet.icon}</div>
            </div>
            <div className="p-6 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">
                  {faucet.name}
                </h3>
                <p className="text-frosted-mint text-sm mb-4">
                  {faucet.description}
                </p>
              </div>
              <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">
                Get Crypto →
              </span>
            </div>
          </a>
        );
      }

      return (
        <div
          key={`faucet-${idx}`}
          className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col cursor-pointer"
        >
          <div className="relative w-full h-48 bg-shadow-grey overflow-hidden flex items-center justify-center">
            <div className="text-6xl text-faded-copper">💧</div>
          </div>
          <div className="p-6 text-center flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">
                Faucet {idx + 1}
              </h3>
              <p className="text-frosted-mint text-sm mb-4">
                Faucet description and link will go here.
              </p>
            </div>
            <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">
              Get Crypto →
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gold">
            MDMPro <span className="text-frosted-mint">Faucets</span>
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Faucets</h1>
          <p className="text-frosted-mint text-lg">(Go On Get Sum!!)</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderFaucetTiles(20)}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-shadow-grey border-t-2 border-faded-copper mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="text-gold hover:text-frosted-mint transition-colors">
            ← Back to Home
          </Link>
          <p className="text-faded-copper text-sm mt-4">
            Free crypto from faucets - claim your rewards!
          </p>
        </div>
      </footer>
    </div>
  );
}
