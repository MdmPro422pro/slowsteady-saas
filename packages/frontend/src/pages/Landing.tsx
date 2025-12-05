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
            <Link 
              to="/business"
              className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
              style={{ 
                borderColor: '#8c705f',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
            >
              Business?
            </Link>
            <Link 
              to="/personal"
              className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
              style={{ 
                borderColor: '#8c705f',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
            >
              Personal?
            </Link>
          </div>
          <Link 
            to="/admin"
            className="px-8 py-4 border-2 rounded-lg text-gold hover:bg-gold hover:text-shadow-grey transition-all duration-300"
            style={{ 
              borderColor: '#8c705f',
              fontSize: '15px',
              backgroundColor: 'transparent'
            }}
          >
            Admin?
          </Link>
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

      {/* Products Section */}
      <section className="py-16 px-6 bg-shadow-grey">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gold text-center mb-2">Need Products?</h2>
          <p className="text-center text-frosted-mint mb-12 text-sm">(Helpful things to have!)</p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Product 1 - Ledger */}
            <a 
              href="https://www.amazon.com/gp/aw/d/B0FDL69NTK?_encoding=UTF8&pd_rd_plhdr=t&aaxitk=ff52f507a06ca6d42c58fcf067149bc0&hsa_cr_id=0&qid=1764910274&sr=1-3-f02f01d6-adaf-4bef-9a7c-29308eff9043&pd_rd_w=PJRud&content-id=amzn1.sym.e2c9099f-6964-4dbf-9ce9-8bc2c1a8ec1a%3Aamzn1.sym.e2c9099f-6964-4dbf-9ce9-8bc2c1a8ec1a&pf_rd_p=e2c9099f-6964-4dbf-9ce9-8bc2c1a8ec1a&pf_rd_r=FNPN6TG6A47DM9S6H373&pd_rd_wg=etcer&pd_rd_r=4b7bc04c-60b5-4fa3-8ddf-a540cd4efb73&th=1&linkCode=ll1&tag=mdmproorg20-20&linkId=0bd85f34e921ddbdef22a1b2be9f4c66&language=en_US&ref_=as_li_ss_tl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48 bg-shadow-grey overflow-hidden">
                <img 
                  src="/src/assets/ledger.png.jpg" 
                  alt="Ledger Hardware Wallet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">Ledger Wallet</h3>
                  <p className="text-frosted-mint text-sm mb-4">Industry-leading hardware wallet with advanced security features.</p>
                </div>
                <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">Learn More →</span>
              </div>
            </a>

            {/* Product 2 - Tangem Wallet */}
            <a 
              href="https://www.amazon.com/gp/product/B0CL9TGD85?smid=A197VOHMC5BCCA&th=1&linkCode=ll1&tag=mdmproorg20-20&linkId=1cec1351d9194db713fe25290813b004&language=en_US&ref_=as_li_ss_tl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48 bg-shadow-grey overflow-hidden">
                <img 
                  src="/src/assets/tangem.png.jpg" 
                  alt="Tangem Hardware Wallet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">Tangem Wallet</h3>
                  <p className="text-frosted-mint text-sm mb-4">Ultra-secure hardware wallet. Store your crypto offline with ease.</p>
                </div>
                <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">Learn More →</span>
              </div>
            </a>

            {/* Product 3 - Gun Safe */}
            <a 
              href="https://www.amazon.com/LANGGER-Biometric-Slider-Handgun-Nightstand/dp/B08VHR4RQS?crid=45HV2P5BA6KF&dib=eyJ2IjoiMSJ9.vrvNvIha92dQjU1e4OE_agjk-QlysjaBH83NOXLlYjMi-BuPiRZBOz4wojsifAcDQQli6ySkFgbS6_a4b0ZKWGJbZYDd_WVuQxPDIaLCzUF5p88oKeoAw48ZSHX13uy7EPz5-nLTZQXnjMd06oS44ZBZaYsyMRL6H9RKctXm3BU-9aWq9V0sOUrWhSswicKl-QghlY1qEkmAqy1k4lulBmZ7M3yrdWyXt76TuveKpMRkpe9aeiLZ3YPJNewF9P_qwt4hFL2jm95EaUoCn4i0BNIS0UIpYtG4JOkfKKv-bxo.apK71M4EfrMd44C21dRsMKga3sljeoz_uCA-YA0C468&dib_tag=se&keywords=gun%2Bsafe&qid=1764910421&sprefix=gun%2Bsafe%2Caps%2C699&sr=8-2&th=1&linkCode=ll1&tag=mdmproorg20-20&linkId=9b29e934acd078884bfc06212e72f3f0&language=en_US&ref_=as_li_ss_tl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48 bg-shadow-grey overflow-hidden">
                <img 
                  src="/src/assets/gunsafe,png.jpg" 
                  alt="Biometric Gun Safe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">Biometric Gun Safe</h3>
                  <p className="text-frosted-mint text-sm mb-4">Secure your valuables with fingerprint recognition technology.</p>
                </div>
                <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">Learn More →</span>
              </div>
            </a>
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
