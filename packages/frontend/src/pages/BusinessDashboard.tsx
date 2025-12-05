import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gold">
              MDMPro <span className="text-frosted-mint">Business</span>
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
                Contracts
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'team' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'analytics' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'billing' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Billing
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
            <h1 className="text-4xl font-bold text-gold mb-8">Business Overview</h1>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Active Contracts</p>
                <p className="text-3xl font-bold text-frosted-mint">24</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Team Members</p>
                <p className="text-3xl font-bold text-frosted-mint">8</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-frosted-mint">$89,500</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Monthly Transactions</p>
                <p className="text-3xl font-bold text-frosted-mint">1,247</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  Deploy New Contract
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  Invite Team Member
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  View Reports
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Contract Deployed', contract: 'ERC-20 Token', time: '2 hours ago' },
                  { action: 'Team Member Added', contract: 'john@company.com', time: '5 hours ago' },
                  { action: 'Multi-sig Transaction', contract: 'Approved by 3/5', time: '1 day ago' },
                  { action: 'Contract Updated', contract: 'ERC-721 NFT', time: '2 days ago' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-faded-copper last:border-b-0">
                    <div>
                      <p className="text-frosted-mint font-semibold">{activity.action}</p>
                      <p className="text-faded-copper text-sm">{activity.contract}</p>
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
            <h1 className="text-4xl font-bold text-gold mb-8">Smart Contract Management</h1>
            
            {/* Deploy New Contract */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Deploy New Contract</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-faded-copper mb-2">Contract Type</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>ERC-20 Token</option>
                    <option>ERC-721 NFT</option>
                    <option>ERC-1155 Multi-Token</option>
                    <option>Custom Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Network</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>Polygon Mainnet</option>
                    <option>Polygon Amoy (Testnet)</option>
                    <option>Ethereum Mainnet</option>
                    <option>Base</option>
                  </select>
                </div>
              </div>
              <button className="bg-gold hover:bg-faded-copper text-shadow-grey font-bold py-3 px-8 rounded-lg transition-all">
                Deploy Contract
              </button>
            </div>

            {/* Active Contracts List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Active Contracts</h2>
              <div className="space-y-4">
                {[
                  { name: 'Company Token', type: 'ERC-20', network: 'Polygon', status: 'Active' },
                  { name: 'NFT Collection', type: 'ERC-721', network: 'Ethereum', status: 'Active' },
                  { name: 'Gaming Assets', type: 'ERC-1155', network: 'Polygon', status: 'Active' },
                  { name: 'Loyalty Rewards', type: 'ERC-20', network: 'Base', status: 'Paused' },
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
                      <button className="text-gold hover:text-frosted-mint transition-colors">Manage →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Team Management</h1>
            
            {/* Invite Member */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Invite Team Member</h2>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="team@company.com"
                  className="flex-1 bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                />
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Developer</option>
                  <option>Viewer</option>
                </select>
                <button className="bg-gold hover:bg-faded-copper text-shadow-grey font-bold py-3 px-8 rounded-lg transition-all">
                  Send Invite
                </button>
              </div>
            </div>

            {/* Team Members List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Team Members</h2>
              <div className="space-y-4">
                {[
                  { name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@company.com', role: 'Manager', status: 'Active' },
                  { name: 'Bob Johnson', email: 'bob@company.com', role: 'Developer', status: 'Active' },
                  { name: 'Alice Wilson', email: 'alice@company.com', role: 'Viewer', status: 'Pending' },
                ].map((member, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div>
                      <p className="text-frosted-mint font-bold">{member.name}</p>
                      <p className="text-faded-copper text-sm">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-faded-copper">{member.role}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        member.status === 'Active' ? 'bg-frosted-mint text-midnight-violet' : 'bg-clay-soil text-frosted-mint'
                      }`}>
                        {member.status}
                      </span>
                      <button className="text-gold hover:text-frosted-mint transition-colors">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Business Analytics</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Transaction Volume</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: Monthly transaction trends</p>
                </div>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Gas Usage</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: Gas consumption by contract</p>
                </div>
              </div>
            </div>

            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-4">Contract Performance</h3>
              <div className="space-y-4">
                {[
                  { contract: 'Company Token', transactions: '8,432', gas: '2.4 ETH', uptime: '99.9%' },
                  { contract: 'NFT Collection', transactions: '3,156', gas: '1.8 ETH', uptime: '100%' },
                  { contract: 'Gaming Assets', transactions: '12,891', gas: '4.2 ETH', uptime: '99.7%' },
                ].map((perf, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div>
                      <p className="text-faded-copper text-sm">Contract</p>
                      <p className="text-frosted-mint font-semibold">{perf.contract}</p>
                    </div>
                    <div>
                      <p className="text-faded-copper text-sm">Transactions</p>
                      <p className="text-frosted-mint font-semibold">{perf.transactions}</p>
                    </div>
                    <div>
                      <p className="text-faded-copper text-sm">Gas Used</p>
                      <p className="text-frosted-mint font-semibold">{perf.gas}</p>
                    </div>
                    <div>
                      <p className="text-faded-copper text-sm">Uptime</p>
                      <p className="text-frosted-mint font-semibold">{perf.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Billing & Payments</h1>
            
            {/* Current Plan */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Current Plan: Business Pro</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-faded-copper mb-2">Monthly Cost</p>
                  <p className="text-3xl font-bold text-frosted-mint">$499</p>
                </div>
                <div>
                  <p className="text-faded-copper mb-2">Contracts Included</p>
                  <p className="text-3xl font-bold text-frosted-mint">50</p>
                </div>
                <div>
                  <p className="text-faded-copper mb-2">Next Billing</p>
                  <p className="text-3xl font-bold text-frosted-mint">Jan 1, 2026</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Payment History</h2>
              <div className="space-y-3">
                {[
                  { date: 'Dec 1, 2025', amount: '$499.00', status: 'Paid', invoice: 'INV-2025-12' },
                  { date: 'Nov 1, 2025', amount: '$499.00', status: 'Paid', invoice: 'INV-2025-11' },
                  { date: 'Oct 1, 2025', amount: '$499.00', status: 'Paid', invoice: 'INV-2025-10' },
                ].map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-faded-copper text-sm">Date</p>
                        <p className="text-frosted-mint font-semibold">{payment.date}</p>
                      </div>
                      <div>
                        <p className="text-faded-copper text-sm">Amount</p>
                        <p className="text-frosted-mint font-semibold">{payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-faded-copper text-sm">Invoice</p>
                        <p className="text-frosted-mint font-semibold">{payment.invoice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-frosted-mint text-midnight-violet">
                        {payment.status}
                      </span>
                      <button className="text-gold hover:text-frosted-mint transition-colors">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
