import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';

export default function ProductsPage() {
  const [activeSection, setActiveSection] = useState('all');

  const sections = [
    { id: 'hardware', name: 'Hardware Wallets', count: 10 },
    { id: 'security', name: 'Security Devices', count: 10 },
    { id: 'storage', name: 'Storage Solutions', count: 10 },
    { id: 'accessories', name: 'Crypto Accessories', count: 10 },
    { id: 'books', name: 'Books & Education', count: 10 },
  ];

  const renderProductTiles = (sectionId: string, count: number) => {
    return Array.from({ length: count }, (_, idx) => (
      <div
        key={`${sectionId}-${idx}`}
        className="rounded-lg bg-midnight-violet hover:bg-clay-soil transition-all duration-300 border-2 border-faded-copper group overflow-hidden flex flex-col cursor-pointer"
      >
        <div className="relative w-full h-48 bg-shadow-grey overflow-hidden flex items-center justify-center">
          <div className="text-6xl text-faded-copper">📦</div>
        </div>
        <div className="p-6 text-center flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-frosted-mint transition-colors">
              Product {idx + 1}
            </h3>
            <p className="text-frosted-mint text-sm mb-4">
              Product description will go here. Perfect for your crypto needs.
            </p>
          </div>
          <span className="text-gold font-semibold group-hover:text-frosted-mint transition-colors">
            Learn More →
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-midnight-violet">
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gold">
              MDMPro <span className="text-frosted-mint">Products</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-3 py-2 transition-colors ${
                  activeSection === 'all' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                All Products
              </button>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-3 py-2 transition-colors ${
                    activeSection === section.id ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Need Products?</h1>
          <p className="text-frosted-mint text-lg">(Helpful things to have!)</p>
        </div>

        {/* All Products View */}
        {activeSection === 'all' && (
          <div className="space-y-16">
            {sections.map((section) => (
              <section key={section.id}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gold">{section.name}</h2>
                  <span className="text-faded-copper">{section.count} products</span>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {renderProductTiles(section.id, section.count)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Individual Section Views */}
        {activeSection !== 'all' && (
          <div>
            {sections
              .filter((section) => section.id === activeSection)
              .map((section) => (
                <section key={section.id}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gold">{section.name}</h2>
                    <span className="text-faded-copper">{section.count} products</span>
                  </div>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {renderProductTiles(section.id, section.count)}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-shadow-grey border-t-2 border-faded-copper mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/" className="text-gold hover:text-frosted-mint transition-colors">
            ← Back to Home
          </Link>
          <p className="text-faded-copper text-sm mt-4">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </footer>
    </div>
  );
}
