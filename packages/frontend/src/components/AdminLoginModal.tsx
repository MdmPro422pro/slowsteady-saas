import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Master admin credentials - In production, this should be handled by backend authentication
const MASTER_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'MasterControl2025!', // Change this to your secure password
};

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (
        username === MASTER_ADMIN_CREDENTIALS.username &&
        password === MASTER_ADMIN_CREDENTIALS.password
      ) {
        // Set admin session
        const adminSession = {
          isAdmin: true,
          loginTime: new Date().toISOString(),
          username: username,
        };
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        sessionStorage.setItem('adminAuthenticated', 'true');
        
        // Navigate to admin dashboard
        navigate('/admin-master');
        onClose();
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 500);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-midnight-violet border-2 border-gold rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-frosted-mint hover:text-gold text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold text-gold mb-2">
            Master Control
          </h2>
          <p className="text-faded-copper text-sm">
            Administrator Access Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-frosted-mint text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-frosted-mint text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-clay-soil border-2 border-faded-copper rounded-lg p-3">
              <p className="text-frosted-mint text-sm text-center">
                ⚠️ {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isLoading
                ? 'bg-shadow-grey text-faded-copper cursor-not-allowed'
                : 'bg-gold text-shadow-grey hover:bg-faded-copper'
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Access Control Panel'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-faded-copper">
          <p className="text-faded-copper text-xs text-center">
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
