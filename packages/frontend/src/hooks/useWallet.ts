import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';

/**
 * Custom hook for wallet management with error handling
 * Handles wallet switching and connection errors gracefully
 */
export function useWallet() {
  const account = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);

  // Clear errors when wallet changes
  useEffect(() => {
    setError(null);
  }, [account.address, chainId]);

  // Handle connection errors
  useEffect(() => {
    if (account.status === 'reconnecting') {
      setError('Reconnecting wallet...');
    } else if (account.status === 'connecting') {
      setError(null);
    } else if (account.status === 'disconnected') {
      setError(null);
    }
  }, [account.status]);

  const handleDisconnect = () => {
    try {
      disconnect();
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  return {
    address: account.address,
    isConnected: account.isConnected,
    isConnecting: account.isConnecting,
    isReconnecting: account.isReconnecting,
    isDisconnected: account.isDisconnected,
    chainId,
    status: account.status,
    error,
    disconnect: handleDisconnect,
  };
}
