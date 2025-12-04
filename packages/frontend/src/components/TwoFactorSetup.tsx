import React, { useState, useEffect } from 'react';
import { twoFactorAPI } from '../lib/api';

interface TwoFactorSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onSuccess, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSetup();
  }, []);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await twoFactorAPI.setup();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await twoFactorAPI.verify(code);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Enable Two-Factor Authentication</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {step === 'setup' && loading && (
        <p className="text-center">Loading...</p>
      )}

      {step === 'verify' && (
        <>
          <div className="mb-6 space-y-4">
            <p className="text-sm text-gray-600">
              1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="2FA QR Code" className="border rounded p-2" />
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
              <p className="font-mono text-sm break-all">{secret}</p>
            </div>

            <p className="text-sm text-gray-600">
              2. Enter the 6-digit code from your app to verify:
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Authentication Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full px-3 py-2 border rounded text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Enable 2FA'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
