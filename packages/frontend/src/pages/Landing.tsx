import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';
import logoVideo from '../assets/logo.mp4';

export default function Landing() {
  return (
    <div className="min-h-screen bg-shadow-grey text-frosted-mint flex flex-col">
      {/* Dashboard Panel */}
      <DashboardPanel />
      
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-midnight-violet">
        <video 
          src={logoVideo}
          autoPlay
          loop
          muted
          playsInline
          className="h-12 w-auto object-contain"
        />
        <WalletButton />
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h1 className="text-6xl font-bold mb-2 text-gold">
          MDMPro
        </h1>
        <p className="text-xl font-light text-gold mb-8">
          Here, for what you need.
        </p>
        <p className="text-lg text-frosted-mint max-w-xl mb-8">
          Secure, transparent, and built for traders who demand performance.
        </p>
        <div className="flex gap-4 mb-12">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-gold hover:bg-faded-copper text-midnight-violet font-semibold transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Option Buttons Section */}
      <section className="py-12 px-6 bg-shadow-grey">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6">
            <button 
              className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
              style={{ 
                borderColor: '#8c705f',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
            >
              Business?
            </button>
            <button 
              className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
              style={{ 
                borderColor: '#8c705f',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
            >
              Personal?
            </button>
          </div>
          <button 
            className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
            style={{ 
              borderColor: '#8c705f',
              fontSize: '15px',
              backgroundColor: 'transparent'
            }}
          >
            Admin?
          </button>
        </div>
      </section>

      {/* Smart Contract Standards Section */}
      <section className="py-16 px-6 bg-midnight-violet">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gold text-center mb-4">Smart Contract Standards</h2>
          <p className="text-center text-frosted-mint mb-12 text-lg">Choose the perfect blockchain solution for your needs</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ERC-20 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-20</h3>
              <p className="text-sm text-faded-copper mb-3">Fungible Tokens</p>
              <p className="text-frosted-mint mb-4 text-sm">Identical units like stablecoins. Simple transfer and balance functions.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$500 - $3,000</span>
                <span className="text-xs bg-clay-soil px-3 py-1 rounded-full text-frosted-mint">Low Complexity</span>
              </div>
            </button>

            {/* ERC-721 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-721</h3>
              <p className="text-sm text-faded-copper mb-3">Non-Fungible Tokens (NFTs)</p>
              <p className="text-frosted-mint mb-4 text-sm">Unique digital assets with metadata and marketplace integration.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$3,000 - $10,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Medium</span>
              </div>
            </button>

            {/* ERC-1155 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-1155</h3>
              <p className="text-sm text-faded-copper mb-3">Multi-Token Standard</p>
              <p className="text-frosted-mint mb-4 text-sm">Fungible + non-fungible in one. Perfect for gaming and marketplaces.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$5,000 - $15,000</span>
                <span className="text-xs bg-clay-soil px-3 py-1 rounded-full text-frosted-mint">High Complexity</span>
              </div>
            </button>

            {/* ERC-777 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-777</h3>
              <p className="text-sm text-faded-copper mb-3">Advanced Fungible Tokens</p>
              <p className="text-frosted-mint mb-4 text-sm">Custom logic with hooks. More flexible but requires security audits.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$5,000 - $12,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Medium-High</span>
              </div>
            </button>

            {/* ERC-998 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-998</h3>
              <p className="text-sm text-faded-copper mb-3">Composable NFTs</p>
              <p className="text-frosted-mint mb-4 text-sm">NFTs owning other NFTs. Complex hierarchies for metaverse/gaming.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$8,000 - $20,000</span>
                <span className="text-xs bg-clay-soil px-3 py-1 rounded-full text-frosted-mint">High Complexity</span>
              </div>
            </button>

            {/* ERC-223 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-223</h3>
              <p className="text-sm text-faded-copper mb-3">Safer Fungible Tokens</p>
              <p className="text-frosted-mint mb-4 text-sm">Prevents accidental loss with recipient-side handling.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$2,000 - $6,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Low-Medium</span>
              </div>
            </button>

            {/* ERC-827 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-827</h3>
              <p className="text-sm text-faded-copper mb-3">ERC-20 Extension</p>
              <p className="text-frosted-mint mb-4 text-sm">TransferAndCall functions for executing logic during transfers.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$3,000 - $7,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Medium</span>
              </div>
            </button>

            {/* ERC-865 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-865</h3>
              <p className="text-sm text-faded-copper mb-3">Gas Fee Delegation</p>
              <p className="text-frosted-mint mb-4 text-sm">Pay gas fees in tokens instead of ETH. Better user experience.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$4,000 - $8,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Medium</span>
              </div>
            </button>

            {/* ERC-1132 */}
            <button className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition-all duration-300 text-left border-2 border-faded-copper">
              <h3 className="text-2xl font-bold text-gold mb-2">ERC-1132</h3>
              <p className="text-sm text-faded-copper mb-3">Token Locking</p>
              <p className="text-frosted-mint mb-4 text-sm">Time-based restrictions for vesting schedules and governance.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$3,000 - $7,000</span>
                <span className="text-xs bg-faded-copper px-3 py-1 rounded-full text-frosted-mint">Medium</span>
              </div>
            </button>

            {/* Custom Contracts */}
            <button className="p-6 rounded-lg bg-clay-soil hover:bg-faded-copper transition-all duration-300 text-left border-2 border-gold">
              <h3 className="text-2xl font-bold text-gold mb-2">Custom Contract</h3>
              <p className="text-sm text-gold mb-3">Bespoke Solutions</p>
              <p className="text-frosted-mint mb-4 text-sm">Tailored logic for DeFi, DAOs, marketplaces. Full customization.</p>
              <div className="flex justify-between items-center">
                <span className="text-gold font-semibold">$10,000 - $50,000+</span>
                <span className="text-xs bg-gold px-3 py-1 rounded-full text-shadow-grey font-semibold">Very High</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-midnight-violet py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition">
            <h2 className="text-xl font-bold text-gold mb-2">Fast Trades</h2>
            <p className="text-frosted-mint">
              Execute trades instantly with our optimized backend and Redis caching.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition">
            <h2 className="text-xl font-bold text-gold mb-2">Secure Auth</h2>
            <p className="text-frosted-mint">
              Two‑factor authentication and JWT‑based sessions keep your assets safe.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-shadow-grey hover:bg-clay-soil transition">
            <h2 className="text-xl font-bold text-gold mb-2">Analytics</h2>
            <p className="text-frosted-mint">
              Real‑time dashboards with high‑contrast charts for clear decision making.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-frosted-mint bg-midnight-violet">
        <p>© 2025 Slowsteady Crypto. All rights reserved.</p>
      </footer>
    </div>
  );
}
