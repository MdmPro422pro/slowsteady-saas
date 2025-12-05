import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';

export default function GamingPage() {
  return (
    <div className="min-h-screen bg-midnight-violet">
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gold">
            MDMPro <span className="text-frosted-mint">Gaming</span>
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* Main Content - Blank for now */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">Gaming?</h1>
          <p className="text-frosted-mint text-lg">(Just passing some time?)</p>
          <p className="text-faded-copper text-sm mt-8">Games coming soon...</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-shadow-grey border-t-2 border-faded-copper fixed bottom-0 w-full py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="text-gold hover:text-frosted-mint transition-colors">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
