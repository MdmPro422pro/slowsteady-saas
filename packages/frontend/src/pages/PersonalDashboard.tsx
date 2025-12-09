import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';
import { useBlockchainData } from '../hooks/useBlockchainData';
import { SkeletonBalance, SkeletonTable } from '../components/Skeleton';

export default function PersonalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { isConnected } = useAccount();
  const { 
    balance, 
    transactions, 
    totalUsdValue,
    isLoadingBalance, 
    isLoadingTxs,
    chain,
    address 
  } = useBlockchainData();

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gold">
              MDMPro <span className="text-frosted-mint">Personal</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'overview' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'contracts' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                My Contracts
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'wallet' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Wallet
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'history' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                History
              </button>
            </nav>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Personal Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">My Contracts</p>
                <p className="text-3xl font-bold text-frosted-mint">5</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-frosted-mint">$8,500</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Transactions</p>
                <p className="text-3xl font-bold text-frosted-mint">142</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  Create New Contract
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  View Transaction History
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Token Transfer', details: '100 MDM sent', time: '1 hour ago' },
                  { action: 'Contract Deployed', details: 'ERC-20 Token', time: '3 days ago' },
                  { action: 'NFT Minted', details: 'Digital Art #42', time: '1 week ago' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-faded-copper last:border-b-0">
                    <div>
                      <p className="text-frosted-mint font-semibold">{activity.action}</p>
                      <p className="text-faded-copper text-sm">{activity.details}</p>
                    </div>
                    <p className="text-faded-copper text-sm">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">My Smart Contracts</h1>
            
            {/* Create Contract */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Create New Contract</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-faded-copper mb-2">Contract Type</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>ERC-20 Token</option>
                    <option>ERC-721 NFT</option>
                    <option>Simple Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Network</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>Polygon Amoy (Testnet)</option>
                    <option>Polygon Mainnet</option>
                  </select>
                </div>
              </div>
              <button className="bg-gold hover:bg-faded-copper text-shadow-grey font-bold py-3 px-8 rounded-lg transition-all">
                Create Contract
              </button>
            </div>

            {/* My Contracts List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">My Contracts</h2>
              <div className="space-y-4">
                {[
                  { name: 'My Personal Token', type: 'ERC-20', network: 'Polygon', status: 'Active' },
                  { name: 'NFT Collection', type: 'ERC-721', network: 'Polygon', status: 'Active' },
                  { name: 'Test Contract', type: 'Storage', network: 'Amoy', status: 'Testing' },
                ].map((contract, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div>
                      <p className="text-frosted-mint font-bold text-lg">{contract.name}</p>
                      <p className="text-faded-copper text-sm">{contract.type} • {contract.network}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        contract.status === 'Active' ? 'bg-frosted-mint text-midnight-violet' : 'bg-clay-soil text-frosted-mint'
                      }`}>
                        {contract.status}
                      </span>
                      <button className="text-gold hover:text-frosted-mint transition-colors">View →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Wallet Management</h1>
            
            {!isConnected ? (
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-8 text-center">
                <p className="text-gold font-bold text-xl mb-2">🔗 Connect Your Wallet</p>
                <p className="text-frosted-mint">Connect your wallet to view your balance and manage tokens</p>
              </div>
            ) : (
              <>
                {/* Wallet Balance */}
                <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gold">Your Balance</h2>
                    {chain && (
                      <span className="text-frosted-mint text-sm bg-midnight-violet px-3 py-1 rounded-lg">
                        {chain.name}
                      </span>
                    )}
                  </div>
                  
                  {isLoadingBalance ? (
                    <SkeletonBalance />
                  ) : balance ? (
                    <div>
                      <div className="text-center p-6 bg-midnight-violet rounded-lg mb-4">
                        <p className="text-faded-copper text-sm mb-2">{balance.symbol}</p>
                        <p className="text-4xl font-bold text-frosted-mint">{parseFloat(balance.value).toFixed(4)}</p>
                        <p className="text-faded-copper text-sm mt-2">≈ ${balance.usdValue.toFixed(2)} USD</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div className="bg-midnight-violet p-3 rounded-lg">
                          <p className="text-faded-copper mb-1">Network</p>
                          <p className="text-frosted-mint font-semibold">{chain?.name || 'Unknown'}</p>
                        </div>
                        <div className="bg-midnight-violet p-3 rounded-lg">
                          <p className="text-faded-copper mb-1">Address</p>
                          <p className="text-frosted-mint font-mono text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-faded-copper">
                      <p>No balance data available</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Send/Receive */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Send Tokens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-faded-copper mb-2">Token</label>
                    <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                      <option>MATIC</option>
                      <option>ETH</option>
                      <option>USDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-faded-copper mb-2">To Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-faded-copper mb-2">Amount</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                    />
                  </div>
                  <button className="w-full bg-gold hover:bg-faded-copper text-shadow-grey font-bold py-3 rounded-lg transition-all">
                    Send
                  </button>
                </div>
              </div>

              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Receive Tokens</h3>
                <div className="text-center">
                  <div className="bg-frosted-mint p-6 rounded-lg mb-4 inline-block">
                    <p className="text-xs text-midnight-violet">QR Code Placeholder</p>
                    <p className="text-4xl text-midnight-violet">▦</p>
                  </div>
                  <p className="text-faded-copper text-sm mb-2">Your Wallet Address</p>
                  <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-3 break-all">
                    <p className="text-frosted-mint text-sm font-mono">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
                  </div>
                  <button className="mt-4 text-gold hover:text-frosted-mint transition-colors">
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Transaction History</h1>
            
            {/* Filters */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-faded-copper mb-2">Type</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>All Transactions</option>
                    <option>Sent</option>
                    <option>Received</option>
                    <option>Contract Interactions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Network</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>All Networks</option>
                    <option>Polygon</option>
                    <option>Ethereum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Time Period</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gold">Recent Transactions</h2>
                {chain && (
                  <span className="text-frosted-mint text-sm bg-midnight-violet px-3 py-1 rounded-lg">
                    {chain.name}
                  </span>
                )}
              </div>
              
              {!isConnected ? (
                <div className="text-center py-8 bg-midnight-violet rounded-lg">
                  <p className="text-gold font-bold text-lg mb-2">🔗 Connect Your Wallet</p>
                  <p className="text-faded-copper">Connect to view your transaction history</p>
                </div>
              ) : isLoadingTxs ? (
                <SkeletonTable rows={5} />
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 bg-midnight-violet rounded-lg">
                  <p className="text-faded-copper">No recent transactions found in the last 10 blocks</p>
                  <p className="text-faded-copper text-sm mt-2">Transactions will appear here once you make some</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.hash} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                      <div className="flex gap-6 flex-1">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                            tx.type === 'receive' ? 'bg-frosted-mint text-midnight-violet' : 'bg-clay-soil text-frosted-mint'
                          }`}>
                            {tx.type}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${
                            tx.formattedAmount.startsWith('+') ? 'text-frosted-mint' : 'text-faded-copper'
                          }`}>
                            {tx.formattedAmount}
                          </p>
                          <p className="text-faded-copper text-sm font-mono">{tx.shortTo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-faded-copper text-sm">{tx.timeAgo}</p>
                        <p className="text-frosted-mint text-xs capitalize">{tx.status}</p>
                        <a 
                          href={`${chain?.blockExplorers?.default.url}/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:text-frosted-mint text-xs mt-1 inline-block"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div>
            <p className="text-faded-copper">Preferences coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
