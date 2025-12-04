import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-black text-offwhite flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-dark-nearblack">
        <h1 className="text-2xl font-bold text-gold">Slowsteady</h1>
        <WalletButton />
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h1 className="text-5xl font-bold mb-4 text-gold">
          Slowsteady Crypto Platform
        </h1>
        <p className="text-lg text-lightgrey max-w-xl mb-8">
          Secure, transparent, and built for traders who demand performance.
        </p>
        <div className="flex gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-steelblue hover:bg-rose text-offwhite font-semibold transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-gold hover:bg-crimson text-dark-black font-semibold transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-dark-grey py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg bg-dark-nearblack hover:bg-slateblue transition">
            <h2 className="text-xl font-bold text-neonpurple mb-2">Fast Trades</h2>
            <p className="text-mediumgrey">
              Execute trades instantly with our optimized backend and Redis caching.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-dark-nearblack hover:bg-garnet transition">
            <h2 className="text-xl font-bold text-gold mb-2">Secure Auth</h2>
            <p className="text-mediumgrey">
              Two‑factor authentication and JWT‑based sessions keep your assets safe.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-dark-nearblack hover:bg-royalpurple transition">
            <h2 className="text-xl font-bold text-steelblue mb-2">Analytics</h2>
            <p className="text-mediumgrey">
              Real‑time dashboards with high‑contrast charts for clear decision making.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-lightgrey bg-dark-nearblack">
        <p>© 2025 Slowsteady Crypto. All rights reserved.</p>
      </footer>
    </div>
  );
}
