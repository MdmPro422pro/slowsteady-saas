import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '../lib/toast';

interface Membership {
  tier: string;
  level: number;
  createdAt: string;
  expiresAt?: string | null;
}

interface UseMembershipReturn {
  membership: Membership | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMembership(): UseMembershipReturn {
  const { address, isConnected } = useAccount();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembership = async () => {
    if (!address || !isConnected) {
      setMembership(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/stripe/membership/${address}`);
      const data = await response.json();

      if (data.success && data.membership) {
        setMembership(data.membership);
      } else {
        setMembership(null);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load membership';
      setError(errorMsg);
      setMembership(null);
      toast.error('Membership Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, [address, isConnected]);

  return {
    membership,
    loading,
    error,
    refetch: fetchMembership,
  };
}
