import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function MembershipSuccess() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [membershipData, setMembershipData] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/stripe/verify-session/${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        // Store membership in localStorage
        localStorage.setItem('membershipTier', JSON.stringify({
          name: data.tier.charAt(0).toUpperCase() + data.tier.slice(1),
          level: parseInt(data.level),
        }));
        setMembershipData(data);
      }
      setVerifying(false);
    } catch (error) {
      console.error('Verification error:', error);
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-violet flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-shadow-grey border-2 border-gold rounded-lg p-8 text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gold mb-2">Verifying Payment...</h1>
            <p className="text-frosted-mint">Please wait while we confirm your membership.</p>
          </>
        ) : membershipData ? (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gold mb-4">Welcome to {membershipData.tier.toUpperCase()}!</h1>
            <p className="text-frosted-mint mb-6">
              Your membership has been activated successfully. You now have access to all {membershipData.tier} tier features.
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full px-6 py-3 bg-gold text-midnight-violet font-bold rounded-lg hover:bg-clay-soil transition"
              >
                Go to Homepage
              </Link>
              <Link
                to="/dashboard"
                className="block w-full px-6 py-3 bg-midnight-violet border-2 border-gold text-gold font-bold rounded-lg hover:bg-clay-soil hover:text-midnight-violet transition"
              >
                View Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-clay-soil mb-4">Verification Failed</h1>
            <p className="text-frosted-mint mb-6">
              We couldn't verify your payment. Please contact support if you were charged.
            </p>
            <Link
              to="/"
              className="block w-full px-6 py-3 bg-clay-soil text-frosted-mint font-bold rounded-lg hover:opacity-80 transition"
            >
              Return Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
