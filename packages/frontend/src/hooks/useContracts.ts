import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

// Map frontend Contract type to backend API format
export interface ApiContract {
  id: string;
  userId: string;
  walletAddress: string;
  title: string;
  description: string;
  content: string; // Full contract details as JSON
  templateType: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  partyAName?: string;
  partyAWallet?: string;
  partyASignature?: string;
  partyASignedAt?: Date;
  partyBName?: string;
  partyBWallet?: string;
  partyBSignature?: string;
  partyBSignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = 'http://localhost:4000';

// Map frontend status to backend status
const mapStatusToBackend = (status: string): ApiContract['status'] => {
  const statusMap: Record<string, ApiContract['status']> = {
    'Pending': 'pending',
    'Active': 'active',
    'Completed': 'completed',
    'Terminated': 'cancelled',
    'On Hold': 'draft',
  };
  return statusMap[status] || 'draft';
};

// Map backend status to frontend status
const mapStatusToFrontend = (status: ApiContract['status']): string => {
  const statusMap: Record<ApiContract['status'], string> = {
    'draft': 'On Hold',
    'pending': 'Pending',
    'active': 'Active',
    'completed': 'Completed',
    'cancelled': 'Terminated',
  };
  return statusMap[status] || 'Pending';
};

export function useContracts() {
  const { address } = useAccount();
  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contracts for current wallet
  const fetchContracts = async () => {
    if (!address) {
      setContracts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/wallet/${address}`, {
        headers: {
          'x-wallet-address': address,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contracts: ${response.statusText}`);
      }

      const data = await response.json();
      setContracts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load contracts');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new contract
  const createContract = async (contractData: {
    title: string;
    description: string;
    content: string;
    templateType: string;
    status?: ApiContract['status'];
    partyAName?: string;
    partyAWallet?: string;
    partyBName?: string;
    partyBWallet?: string;
  }): Promise<ApiContract | null> => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address,
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create contract: ${response.statusText}`);
      }

      const newContract = await response.json();
      setContracts([...contracts, newContract]);
      return newContract;
    } catch (err: any) {
      setError(err.message || 'Failed to create contract');
      console.error('Error creating contract:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing contract
  const updateContract = async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      content: string;
      templateType: string;
      status: ApiContract['status'];
      partyAName: string;
      partyAWallet: string;
      partyASignature: string;
      partyBName: string;
      partyBWallet: string;
      partyBSignature: string;
    }>
  ): Promise<ApiContract | null> => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update contract: ${response.statusText}`);
      }

      const updatedContract = await response.json();
      setContracts(contracts.map(c => (c.id === id ? updatedContract : c)));
      return updatedContract;
    } catch (err: any) {
      setError(err.message || 'Failed to update contract');
      console.error('Error updating contract:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete contract
  const deleteContract = async (id: string): Promise<boolean> => {
    if (!address) {
      setError('Wallet not connected');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-wallet-address': address,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete contract: ${response.statusText}`);
      }

      setContracts(contracts.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete contract');
      console.error('Error deleting contract:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get single contract
  const getContract = async (id: string): Promise<ApiContract | null> => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
        headers: {
          'x-wallet-address': address,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contract: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'Failed to load contract');
      console.error('Error fetching contract:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch contracts when wallet changes
  useEffect(() => {
    fetchContracts();
  }, [address]);

  return {
    contracts,
    loading,
    error,
    createContract,
    updateContract,
    deleteContract,
    getContract,
    refetch: fetchContracts,
    mapStatusToBackend,
    mapStatusToFrontend,
  };
}
