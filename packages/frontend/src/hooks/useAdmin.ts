import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '../lib/toast';

const API_BASE_URL = 'http://localhost:4000';

interface Analytics {
  users: {
    total: number;
    active: number;
  };
  contracts: {
    total: number;
    byStatus: Record<string, number>;
  };
  memberships: {
    total: number;
    byTier: Record<string, number>;
  };
  messages: {
    total: number;
  };
  recentActivity: {
    contracts: any[];
    messages: any[];
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
  walletAddress?: string;
  isAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    contracts: number;
    messages: number;
    memberships: number;
  };
}

interface Contract {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  walletAddress: string;
  user?: {
    email: string;
    walletAddress: string;
  };
}

interface Message {
  id: string;
  content: string;
  username: string;
  room: string;
  createdAt: Date;
}

interface PaginatedResponse<T> {
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}

export function useAdminAnalytics() {
  const { address } = useAccount();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
        headers: {
          'x-wallet-address': address,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load analytics';
      setError(errorMsg);
      toast.error('Analytics Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [address]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

export function useAdminUsers() {
  const { address } = useAccount();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page = 1) => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users?page=${page}&limit=20`,
        {
          headers: {
            'x-wallet-address': address,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load users';
      setError(errorMsg);
      toast.error('Users Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: { isAdmin?: boolean; emailVerified?: boolean }) => {
    if (!address) {
      toast.error('Wallet Required', 'Please connect your wallet');
      return false;
    }

    try {
      const promise = (async () => {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update user');
        }

        const data = await response.json();
        
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, ...data.user } : u));
        
        return data;
      })();

      toast.promise(promise, {
        loading: 'Updating user...',
        success: 'User updated successfully',
        error: (err) => err.message || 'Failed to update user',
      });

      await promise;
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!address) {
      toast.error('Wallet Required', 'Please connect your wallet');
      return false;
    }

    try {
      const promise = (async () => {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'x-wallet-address': address,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to delete user');
        }

        // Remove from local state
        setUsers(users.filter(u => u.id !== userId));
        
        return true;
      })();

      toast.promise(promise, {
        loading: 'Deleting user...',
        success: 'User deleted successfully',
        error: (err) => err.message || 'Failed to delete user',
      });

      await promise;
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [address]);

  return { 
    users, 
    pagination, 
    loading, 
    error, 
    fetchUsers,
    updateUser,
    deleteUser
  };
}

export function useAdminContracts() {
  const { address } = useAccount();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async (page = 1, status?: string) => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (status) params.append('status', status);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contracts?${params}`,
        {
          headers: {
            'x-wallet-address': address,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch contracts');
      }

      const data = await response.json();
      setContracts(data.contracts);
      setPagination(data.pagination);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load contracts';
      setError(errorMsg);
      toast.error('Contracts Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (contractId: string, status: string) => {
    if (!address) {
      toast.error('Wallet Required', 'Please connect your wallet');
      return false;
    }

    try {
      const promise = (async () => {
        const response = await fetch(`${API_BASE_URL}/api/admin/contracts/${contractId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update contract');
        }

        const data = await response.json();
        
        // Update local state
        setContracts(contracts.map(c => c.id === contractId ? { ...c, status } : c));
        
        return data;
      })();

      toast.promise(promise, {
        loading: 'Updating contract...',
        success: 'Contract updated successfully',
        error: (err) => err.message || 'Failed to update contract',
      });

      await promise;
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteContract = async (contractId: string) => {
    if (!address) {
      toast.error('Wallet Required', 'Please connect your wallet');
      return false;
    }

    try {
      const promise = (async () => {
        const response = await fetch(`${API_BASE_URL}/api/admin/contracts/${contractId}`, {
          method: 'DELETE',
          headers: {
            'x-wallet-address': address,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to delete contract');
        }

        // Remove from local state
        setContracts(contracts.filter(c => c.id !== contractId));
        
        return true;
      })();

      toast.promise(promise, {
        loading: 'Deleting contract...',
        success: 'Contract deleted successfully',
        error: (err) => err.message || 'Failed to delete contract',
      });

      await promise;
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [address]);

  return { 
    contracts, 
    pagination, 
    loading, 
    error, 
    fetchContracts,
    updateContract,
    deleteContract
  };
}
