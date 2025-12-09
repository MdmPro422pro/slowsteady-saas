import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '../lib/toast';

interface MembershipPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: {
    name: string;
    price: number;
    level: number;
  };
  currentTier?: {
    name: string;
    price: number;
    level: number;
  } | null;
}

const TIERS = [
  { name: 'Basic', price: 99, level: 1 },
  { name: 'Pro', price: 299, level: 2 },
  { name: 'Elite', price: 999, level: 3 },
];

export function MembershipPurchaseModal({ 
  isOpen, 
  onClose, 
  tier, 
  currentTier 
}: MembershipPurchaseModalProps) {
  const { isConnected, address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  if (!isOpen) return null;

  const isUpgrade = currentTier && tier.level > currentTier.level;
  const isDowngrade = currentTier && tier.level < currentTier.level;
  const isSameTier = currentTier && tier.level === currentTier.level;
  const hasHigherTier = tier.level < 3;

  const handlePurchase = async () => {
    if (!isConnected) {
      toast.warning('Wallet Required', 'Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call backend to create Stripe checkout session
      const response = await fetch('http://localhost:4000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: tier.name.toLowerCase(),
          walletAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment Failed', 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleUpgradeOffer = (accept: boolean) => {
    if (accept) {
      const nextTier = TIERS.find(t => t.level === tier.level + 1);
      if (nextTier) {
        setShowUpgrade(false);
        setPurchaseComplete(false);
        // Reset to show purchase flow for next tier
        window.location.hash = `#upgrade-${nextTier.level}`;
        onClose();
      }
    } else {
      onClose();
      window.location.reload();
    }
  };

  const nextTier = TIERS.find(t => t.level === tier.level + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-midnight-violet border-2 border-gold rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-frosted-mint hover:text-gold text-2xl"
        >
          ×
        </button>

        {/* Purchase Complete - Upgrade Offer */}
        {purchaseComplete && showUpgrade && nextTier && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gold mb-4">
              Welcome to {tier.name}!
            </h2>
            <p className="text-frosted-mint mb-6">
              Your membership is now active.
            </p>
            
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gold mb-3">
                🚀 Upgrade to {nextTier.name}?
              </h3>
              <p className="text-frosted-mint text-sm mb-4">
                Take your experience to the next level with our {nextTier.name} membership for just ${nextTier.price}/month!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpgradeOffer(true)}
                  className="flex-1 py-3 px-6 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
                >
                  Yes, Upgrade!
                </button>
                <button
                  onClick={() => handleUpgradeOffer(false)}
                  className="flex-1 py-3 px-6 rounded-lg bg-shadow-grey text-frosted-mint font-semibold hover:bg-clay-soil transition-colors border-2 border-faded-copper"
                >
                  No Thanks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Complete - No Upgrade (Highest Tier) */}
        {purchaseComplete && !showUpgrade && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gold mb-4">
              Welcome to {tier.name}!
            </h2>
            <p className="text-frosted-mint mb-6">
              Your membership is now active.
            </p>
            {tier.level === 3 && (
              <div className="bg-shadow-grey border-2 border-gold rounded-lg p-4 mb-4">
                <p className="text-gold font-semibold">
                  🏆 You're on our highest tier!
                </p>
                <p className="text-frosted-mint text-sm mt-2">
                  Enjoy all premium features and exclusive benefits.
                </p>
              </div>
            )}
            <p className="text-faded-copper text-sm">Redirecting...</p>
          </div>
        )}

        {/* Purchase Flow */}
        {!purchaseComplete && (
          <>
            <h2 className="text-2xl font-bold text-gold mb-4 text-center">
              {isUpgrade ? 'Upgrade to' : isSameTier ? 'Current Tier' : isDowngrade ? 'Downgrade to' : 'Purchase'} {tier.name}
            </h2>

            {isSameTier && (
              <div className="bg-clay-soil border-2 border-faded-copper rounded-lg p-4 mb-4">
                <p className="text-frosted-mint text-center">
                  You're already on the {tier.name} tier!
                </p>
              </div>
            )}

            {isDowngrade && (
              <div className="bg-clay-soil border-2 border-faded-copper rounded-lg p-4 mb-4">
                <p className="text-frosted-mint text-sm text-center">
                  ⚠️ This will downgrade your membership from {currentTier?.name} to {tier.name}
                </p>
              </div>
            )}

            <div className="bg-shadow-grey rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gold mb-2">
                  ${tier.price}
                </div>
                <p className="text-frosted-mint text-sm">per month</p>
              </div>
              
              <div className="border-t border-faded-copper pt-4">
                <p className="text-frosted-mint text-sm mb-2">
                  Features included:
                </p>
                <ul className="text-faded-copper text-sm space-y-1">
                  <li>✓ More info coming soon...</li>
                  <li>✓ Premium benefits</li>
                  <li>✓ Exclusive access</li>
                </ul>
              </div>
            </div>

            {!isConnected && (
              <div className="bg-clay-soil border-2 border-faded-copper rounded-lg p-4 mb-4">
                <p className="text-frosted-mint text-sm text-center">
                  ⚠️ Please connect your wallet to purchase
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-lg bg-shadow-grey text-frosted-mint font-semibold hover:bg-clay-soil transition-colors border-2 border-faded-copper"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={isProcessing || !isConnected || !!isSameTier}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isProcessing || !isConnected || isSameTier
                    ? 'bg-shadow-grey text-faded-copper cursor-not-allowed'
                    : 'bg-gold text-shadow-grey hover:bg-faded-copper'
                }`}
              >
                {isProcessing ? 'Processing...' : isSameTier ? 'Current Tier' : isUpgrade ? 'Upgrade Now' : 'Purchase Now'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
