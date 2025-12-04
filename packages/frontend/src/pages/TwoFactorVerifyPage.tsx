import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function TwoFactorVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, refreshUser } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tempToken = location.state?.tempToken;

  useEffect(() => {
    if (!tempToken) {
      navigate('/login');
    }
  }, [tempToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/2fa/login-verify', {
        tempToken,
        code
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAccessToken(accessToken);
      
      await refreshUser();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid 2FA code');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit code from your authenticator app
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );
}
