import { useState, useEffect } from 'react';
import { useAccount, useBalance, useBlockNumber, usePublicClient } from 'wagmi';
import { formatEther } from 'viem';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  usdValue: number;
}

export interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'contract';
  amount: string;
  token: string;
  from: string;
  to: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: bigint;
}

export function useBlockchainData() {
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: currentBlock } = useBlockNumber({ watch: true });
  
  // Get native token balance
  const { data: nativeBalance, isLoading: isLoadingBalance, refetch: refetchBalance } = useBalance({
    address,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);
  const [totalUsdValue, setTotalUsdValue] = useState(0);

  // Fetch transaction history
  useEffect(() => {
    if (!address || !publicClient || !currentBlock) return;

    const fetchTransactions = async () => {
      setIsLoadingTxs(true);
      try {
        // Get the last 10 blocks for transaction history
        const blocksToCheck = 10;
        
        const txs: Transaction[] = [];
        
        // Fetch blocks and check for transactions involving this address
        for (let i = 0; i < blocksToCheck; i++) {
          const blockNum = currentBlock - BigInt(i);
          if (blockNum < 0n) break;
          
          try {
            const block = await publicClient.getBlock({ 
              blockNumber: blockNum,
              includeTransactions: true 
            });
            
            // Filter transactions involving this address
            if (block.transactions && Array.isArray(block.transactions)) {
              for (const tx of block.transactions) {
                if (typeof tx === 'object' && tx !== null) {
                  const txObj = tx as any;
                  
                  if (txObj.from?.toLowerCase() === address.toLowerCase() || 
                      txObj.to?.toLowerCase() === address.toLowerCase()) {
                    
                    const isSend = txObj.from?.toLowerCase() === address.toLowerCase();
                    const isContractInteraction = !txObj.to || txObj.input !== '0x';
                    
                    txs.push({
                      hash: txObj.hash,
                      type: isContractInteraction ? 'contract' : (isSend ? 'send' : 'receive'),
                      amount: formatEther(txObj.value || 0n),
                      token: chain?.nativeCurrency.symbol || 'ETH',
                      from: txObj.from || '',
                      to: txObj.to || 'Contract Creation',
                      timestamp: Number(block.timestamp),
                      status: 'confirmed',
                      blockNumber: blockNum,
                    });
                  }
                }
              }
            }
          } catch (blockError) {
            console.error('Error fetching block:', blockNum, blockError);
          }
        }
        
        // Sort by timestamp descending
        txs.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Set empty array on error instead of leaving stale data
        setTransactions([]);
      } finally {
        setIsLoadingTxs(false);
      }
    };

    fetchTransactions();
  }, [address, publicClient, currentBlock, chain]);

  // Calculate total portfolio value (simplified - just native token for now)
  useEffect(() => {
    if (nativeBalance) {
      // Simple mock USD conversion - in production, use a price oracle
      const mockPricePerToken = chain?.id === 137 ? 0.65 : 2500; // MATIC vs ETH rough prices
      const balanceNum = parseFloat(formatEther(nativeBalance.value));
      setTotalUsdValue(balanceNum * mockPricePerToken);
    }
  }, [nativeBalance, chain]);

  // Format transaction for display
  const formatTransaction = (tx: Transaction) => {
    const date = new Date(tx.timestamp * 1000);
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo = 'Just now';
    if (diffMins < 60) {
      timeAgo = `${diffMins}m ago`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours}h ago`;
    } else {
      timeAgo = `${diffDays}d ago`;
    }

    return {
      ...tx,
      timeAgo,
      formattedAmount: `${tx.type === 'send' ? '-' : '+'}${parseFloat(tx.amount).toFixed(4)} ${tx.token}`,
      shortHash: `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`,
      shortFrom: `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`,
      shortTo: tx.to === 'Contract Creation' ? tx.to : `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`,
    };
  };

  // Get balance info
  const balanceInfo = nativeBalance ? {
    value: formatEther(nativeBalance.value),
    symbol: nativeBalance.symbol,
    decimals: nativeBalance.decimals,
    formatted: nativeBalance.formatted,
    usdValue: totalUsdValue,
  } : null;

  return {
    address,
    chain,
    balance: balanceInfo,
    transactions: transactions.map(formatTransaction),
    totalUsdValue,
    isLoadingBalance,
    isLoadingTxs,
    refetchBalance,
    currentBlock,
  };
}
