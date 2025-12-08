import { Link } from 'react-router-dom';

export default function MembershipCancel() {
  return (
    <div className="min-h-screen bg-midnight-violet flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-shadow-grey border-2 border-clay-soil rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-clay-soil mb-4">Payment Cancelled</h1>
        <p className="text-frosted-mint mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <p className="text-faded-copper text-sm mb-6">
          If you encountered any issues, please contact our support team.
        </p>
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full px-6 py-3 bg-gold text-midnight-violet font-bold rounded-lg hover:bg-clay-soil transition"
          >
            Return to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="block w-full px-6 py-3 bg-midnight-violet border-2 border-gold text-gold font-bold rounded-lg hover:bg-clay-soil hover:text-midnight-violet transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
