import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../components/WalletButton';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-midnight-violet">
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gold">
              MDMPro <span className="text-frosted-mint">Admin</span>
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
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'users' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('contracts')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'contracts' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                All Contracts
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
                onClick={() => setActiveTab('revenue')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'revenue' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'settings' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Settings
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
            <h1 className="text-4xl font-bold text-gold mb-8">Platform Overview</h1>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-gold rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gold">2,847</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Total Contracts</p>
                <p className="text-3xl font-bold text-frosted-mint">14,231</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Monthly Revenue</p>
                <p className="text-3xl font-bold text-frosted-mint">$124,500</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Active Sessions</p>
                <p className="text-3xl font-bold text-frosted-mint">342</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">System Health</p>
                <p className="text-3xl font-bold text-frosted-mint">99.8%</p>
              </div>
            </div>

            {/* Platform Health */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gold mb-4">System Status</h2>
                <div className="space-y-3">
                  {[
                    { service: 'API Gateway', status: 'Operational', uptime: '99.9%' },
                    { service: 'Database', status: 'Operational', uptime: '100%' },
                    { service: 'Contract Deployer', status: 'Operational', uptime: '99.7%' },
                    { service: 'Payment Processor', status: 'Operational', uptime: '99.8%' },
                  ].map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-midnight-violet rounded-lg">
                      <div>
                        <p className="text-frosted-mint font-semibold">{service.service}</p>
                        <p className="text-faded-copper text-xs">Uptime: {service.uptime}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-frosted-mint text-midnight-violet">
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gold mb-4">Recent Platform Events</h2>
                <div className="space-y-3">
                  {[
                    { event: 'New Business Account', user: 'Acme Corp', time: '15 min ago' },
                    { event: 'High Volume Alert', user: '500+ contracts/hr', time: '1 hour ago' },
                    { event: 'Payment Processed', user: '$12,500 received', time: '2 hours ago' },
                    { event: 'Security Scan', user: 'All systems secure', time: '3 hours ago' },
                  ].map((event, idx) => (
                    <div key={idx} className="p-3 bg-midnight-violet rounded-lg border-l-4 border-gold">
                      <p className="text-frosted-mint font-semibold">{event.event}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-faded-copper text-sm">{event.user}</p>
                        <p className="text-faded-copper text-xs">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Admin Quick Actions</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <button className="bg-gold hover:bg-faded-copper text-shadow-grey font-semibold py-4 px-6 rounded-lg transition-all">
                  Create Admin User
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  System Maintenance
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  Export All Data
                </button>
                <button className="bg-clay-soil hover:bg-faded-copper text-frosted-mint font-semibold py-4 px-6 rounded-lg transition-all">
                  Security Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">User Management</h1>
            
            {/* User Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Business Accounts</p>
                <p className="text-3xl font-bold text-frosted-mint">523</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Personal Accounts</p>
                <p className="text-3xl font-bold text-frosted-mint">2,298</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Admin Accounts</p>
                <p className="text-3xl font-bold text-frosted-mint">26</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">New This Month</p>
                <p className="text-3xl font-bold text-frosted-mint">+142</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="md:col-span-2 bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                />
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>All Account Types</option>
                  <option>Business</option>
                  <option>Personal</option>
                  <option>Admin</option>
                </select>
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">All Users</h2>
              <div className="space-y-3">
                {[
                  { name: 'Acme Corporation', email: 'admin@acme.com', type: 'Business', contracts: 45, spent: '$52,000', status: 'Active' },
                  { name: 'John Developer', email: 'john@dev.com', type: 'Personal', contracts: 8, spent: '$4,500', status: 'Active' },
                  { name: 'Tech Startup Inc', email: 'info@techstartup.com', type: 'Business', contracts: 23, spent: '$28,000', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@email.com', type: 'Personal', contracts: 3, spent: '$1,200', status: 'Active' },
                  { name: 'Admin User', email: 'admin@mdmpro.com', type: 'Admin', contracts: 0, spent: '$0', status: 'Active' },
                ].map((user, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-frosted-mint font-bold">{user.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          user.type === 'Admin' ? 'bg-gold text-shadow-grey' :
                          user.type === 'Business' ? 'bg-faded-copper text-frosted-mint' :
                          'bg-clay-soil text-frosted-mint'
                        }`}>
                          {user.type}
                        </span>
                      </div>
                      <p className="text-faded-copper text-sm">{user.email}</p>
                    </div>
                    <div className="flex gap-8 items-center">
                      <div>
                        <p className="text-faded-copper text-xs">Contracts</p>
                        <p className="text-frosted-mint font-semibold">{user.contracts}</p>
                      </div>
                      <div>
                        <p className="text-faded-copper text-xs">Spent</p>
                        <p className="text-frosted-mint font-semibold">{user.spent}</p>
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs bg-frosted-mint text-midnight-violet">
                          {user.status}
                        </span>
                      </div>
                      <button className="text-gold hover:text-frosted-mint transition-colors">Manage →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">All Smart Contracts</h1>
            
            {/* Contract Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">ERC-20 Tokens</p>
                <p className="text-3xl font-bold text-frosted-mint">8,432</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">ERC-721 NFTs</p>
                <p className="text-3xl font-bold text-frosted-mint">3,891</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Other Standards</p>
                <p className="text-3xl font-bold text-frosted-mint">1,908</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Deployed Today</p>
                <p className="text-3xl font-bold text-frosted-mint">+47</p>
              </div>
            </div>

            {/* Contract Filters */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>All Contract Types</option>
                  <option>ERC-20</option>
                  <option>ERC-721</option>
                  <option>ERC-1155</option>
                  <option>Custom</option>
                </select>
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>All Networks</option>
                  <option>Polygon</option>
                  <option>Ethereum</option>
                  <option>Base</option>
                </select>
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Failed</option>
                </select>
                <select className="bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            {/* Contracts List */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Recent Deployments</h2>
              <div className="space-y-3">
                {[
                  { contract: 'CompanyToken', type: 'ERC-20', owner: 'Acme Corp', network: 'Polygon', deployed: '2 hours ago', status: 'Active' },
                  { contract: 'ArtNFT', type: 'ERC-721', owner: 'John Dev', network: 'Ethereum', deployed: '5 hours ago', status: 'Active' },
                  { contract: 'GameAssets', type: 'ERC-1155', owner: 'Tech Startup', network: 'Polygon', deployed: '1 day ago', status: 'Active' },
                  { contract: 'CustomDApp', type: 'Custom', owner: 'Jane Smith', network: 'Base', deployed: '2 days ago', status: 'Active' },
                ].map((contract, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div className="flex-1">
                      <p className="text-frosted-mint font-bold text-lg">{contract.contract}</p>
                      <p className="text-faded-copper text-sm">
                        {contract.type} • {contract.network} • Owner: {contract.owner}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-faded-copper text-xs">Deployed</p>
                        <p className="text-frosted-mint text-sm">{contract.deployed}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-frosted-mint text-midnight-violet">
                        {contract.status}
                      </span>
                      <button className="text-gold hover:text-frosted-mint transition-colors">Inspect →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Platform Analytics</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: User registration trends over time</p>
                </div>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Contract Deployments</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: Deployments by contract type</p>
                </div>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Network Distribution</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: Contracts by blockchain network</p>
                </div>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-xl font-bold text-gold mb-4">Revenue Trends</h3>
                <div className="h-64 flex items-center justify-center text-faded-copper">
                  <p>Chart: Monthly revenue breakdown</p>
                </div>
              </div>
            </div>

            {/* Top Performing Metrics */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Top Metrics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-faded-copper mb-3">Top Spending Users</h4>
                  <div className="space-y-2">
                    {[
                      { user: 'Acme Corp', amount: '$52,000' },
                      { user: 'Tech Startup', amount: '$28,000' },
                      { user: 'Digital Agency', amount: '$19,500' },
                    ].map((top, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-midnight-violet rounded">
                        <span className="text-frosted-mint">{top.user}</span>
                        <span className="text-gold font-semibold">{top.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-faded-copper mb-3">Most Active Networks</h4>
                  <div className="space-y-2">
                    {[
                      { network: 'Polygon', contracts: '9,432' },
                      { network: 'Ethereum', contracts: '3,156' },
                      { network: 'Base', contracts: '1,643' },
                    ].map((top, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-midnight-violet rounded">
                        <span className="text-frosted-mint">{top.network}</span>
                        <span className="text-gold font-semibold">{top.contracts}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-faded-copper mb-3">Popular Contract Types</h4>
                  <div className="space-y-2">
                    {[
                      { type: 'ERC-20', count: '8,432' },
                      { type: 'ERC-721', count: '3,891' },
                      { type: 'ERC-1155', count: '1,156' },
                    ].map((top, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-midnight-violet rounded">
                        <span className="text-frosted-mint">{top.type}</span>
                        <span className="text-gold font-semibold">{top.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Revenue Management</h1>
            
            {/* Revenue Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-shadow-grey border-2 border-gold rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-gold">$1.2M</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-frosted-mint">$124,500</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Last Month</p>
                <p className="text-3xl font-bold text-frosted-mint">$118,200</p>
              </div>
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <p className="text-faded-copper text-sm mb-2">Growth</p>
                <p className="text-3xl font-bold text-frosted-mint">+5.3%</p>
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Revenue by Contract Type</h2>
              <div className="space-y-3">
                {[
                  { type: 'ERC-20 Tokens', revenue: '$682,000', percentage: '56%' },
                  { type: 'ERC-721 NFTs', revenue: '$358,000', percentage: '30%' },
                  { type: 'ERC-1155 Multi-Token', revenue: '$122,000', percentage: '10%' },
                  { type: 'Custom Contracts', revenue: '$48,000', percentage: '4%' },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 bg-midnight-violet rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-frosted-mint font-semibold">{rev.type}</span>
                      <span className="text-gold font-bold">{rev.revenue}</span>
                    </div>
                    <div className="w-full bg-shadow-grey rounded-full h-2">
                      <div
                        className="bg-gold rounded-full h-2"
                        style={{ width: rev.percentage }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Recent Payments</h2>
              <div className="space-y-3">
                {[
                  { user: 'Acme Corp', plan: 'Business Pro', amount: '$499', date: 'Dec 1, 2025' },
                  { user: 'Tech Startup', plan: 'Business', amount: '$299', date: 'Dec 1, 2025' },
                  { user: 'John Developer', contract: 'ERC-20 Deploy', amount: '$2,500', date: 'Nov 30, 2025' },
                  { user: 'Digital Agency', plan: 'Business Pro', amount: '$499', date: 'Nov 30, 2025' },
                ].map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-midnight-violet border border-faded-copper rounded-lg">
                    <div>
                      <p className="text-frosted-mint font-bold">{payment.user}</p>
                      <p className="text-faded-copper text-sm">{payment.plan || payment.contract}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-gold font-bold text-lg">{payment.amount}</p>
                        <p className="text-faded-copper text-xs">{payment.date}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-frosted-mint text-midnight-violet">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-4xl font-bold text-gold mb-8">Platform Settings</h1>
            
            {/* General Settings */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-faded-copper mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="MDMPro"
                    className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@mdmpro.com"
                    className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-faded-copper mb-2">Maintenance Mode</label>
                  <select className="w-full bg-midnight-violet border-2 border-faded-copper text-frosted-mint rounded-lg px-4 py-3">
                    <option>Disabled</option>
                    <option>Enabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-midnight-violet rounded-lg">
                  <div>
                    <p className="text-frosted-mint font-semibold">Two-Factor Authentication</p>
                    <p className="text-faded-copper text-sm">Require 2FA for all admin accounts</p>
                  </div>
                  <button className="bg-frosted-mint text-midnight-violet px-4 py-2 rounded-lg font-semibold">
                    Enabled
                  </button>
                </div>
                <div className="flex justify-between items-center p-4 bg-midnight-violet rounded-lg">
                  <div>
                    <p className="text-frosted-mint font-semibold">IP Whitelist</p>
                    <p className="text-faded-copper text-sm">Restrict admin access to specific IPs</p>
                  </div>
                  <button className="bg-clay-soil text-frosted-mint px-4 py-2 rounded-lg font-semibold">
                    Disabled
                  </button>
                </div>
                <div className="flex justify-between items-center p-4 bg-midnight-violet rounded-lg">
                  <div>
                    <p className="text-frosted-mint font-semibold">API Rate Limiting</p>
                    <p className="text-faded-copper text-sm">Limit requests per user</p>
                  </div>
                  <button className="bg-frosted-mint text-midnight-violet px-4 py-2 rounded-lg font-semibold">
                    Enabled
                  </button>
                </div>
              </div>
            </div>

            {/* Contract Pricing */}
            <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Contract Pricing</h2>
              <div className="space-y-3">
                {[
                  { type: 'ERC-20', min: '$500', max: '$3,000' },
                  { type: 'ERC-721', min: '$3,000', max: '$10,000' },
                  { type: 'ERC-1155', min: '$5,000', max: '$15,000' },
                  { type: 'Custom', min: '$10,000', max: '$50,000+' },
                ].map((pricing, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 p-4 bg-midnight-violet rounded-lg">
                    <div>
                      <p className="text-faded-copper text-sm">Type</p>
                      <p className="text-frosted-mint font-semibold">{pricing.type}</p>
                    </div>
                    <div>
                      <p className="text-faded-copper text-sm">Min Price</p>
                      <input
                        type="text"
                        defaultValue={pricing.min}
                        className="bg-shadow-grey border border-faded-copper text-frosted-mint rounded px-3 py-1 w-full"
                      />
                    </div>
                    <div>
                      <p className="text-faded-copper text-sm">Max Price</p>
                      <input
                        type="text"
                        defaultValue={pricing.max}
                        className="bg-shadow-grey border border-faded-copper text-frosted-mint rounded px-3 py-1 w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 bg-gold hover:bg-faded-copper text-shadow-grey font-bold py-3 px-8 rounded-lg transition-all">
                Save Pricing
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
