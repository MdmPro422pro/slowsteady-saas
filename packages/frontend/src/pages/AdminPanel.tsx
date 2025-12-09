import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { WalletButton } from '../components/WalletButton';
import { DashboardPanel } from '../components/DashboardPanel';
import { useAdminAnalytics, useAdminUsers, useAdminContracts } from '../hooks/useAdmin';
import { SkeletonDashboardStats, SkeletonTable } from '../components/Skeleton';
import { toast } from '../lib/toast';

export default function AdminMasterControl() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Fetch admin data
  const { analytics, loading: analyticsLoading, error: analyticsError } = useAdminAnalytics();
  const { users, pagination: usersPagination, loading: usersLoading, fetchUsers, updateUser, deleteUser } = useAdminUsers();
  const { contracts, pagination: contractsPagination, loading: contractsLoading, fetchContracts, updateContract, deleteContract } = useAdminContracts();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      toast.warning('Admin Access Required', 'Please connect your wallet');
    }
  }, [isConnected, navigate]);

  const handlePromoteAdmin = async (userId: string, currentStatus: boolean) => {
    const confirmed = window.confirm(
      currentStatus 
        ? 'Remove admin privileges from this user?' 
        : 'Grant admin privileges to this user?'
    );
    
    if (confirmed) {
      await updateUser(userId, { isAdmin: !currentStatus });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user ${userEmail}? This action cannot be undone.`
    );
    
    if (confirmed) {
      await deleteUser(userId);
    }
  };

  const handleUpdateContractStatus = async (contractId: string, newStatus: string) => {
    await updateContract(contractId, newStatus);
  };

  const handleDeleteContract = async (contractId: string, contractTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete contract "${contractTitle}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      await deleteContract(contractId);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-violet">
      <DashboardPanel />
      
      {/* Header */}
      <header className="bg-shadow-grey border-b-2 border-faded-copper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gold">
              🔐 <span className="text-frosted-mint">Admin Panel</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-2 transition-colors ${
                  activeTab === 'analytics' ? 'text-gold border-b-2 border-gold' : 'text-frosted-mint hover:text-gold'
                }`}
              >
                Analytics
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
                Contracts
              </button>
            </nav>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gold">Platform Analytics</h1>
            </div>

            {analyticsLoading ? (
              <SkeletonDashboardStats />
            ) : analyticsError ? (
              <div className="bg-clay-soil border-2 border-faded-copper rounded-lg p-6 text-center">
                <p className="text-frosted-mint">⚠️ {analyticsError}</p>
                <p className="text-faded-copper text-sm mt-2">You may not have admin permissions</p>
              </div>
            ) : analytics ? (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                    <h3 className="text-faded-copper text-sm mb-2">Total Users</h3>
                    <p className="text-4xl font-bold text-gold">{analytics.users.total}</p>
                    <p className="text-frosted-mint text-sm mt-1">{analytics.users.active} active (30 days)</p>
                  </div>
                  
                  <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                    <h3 className="text-faded-copper text-sm mb-2">Total Contracts</h3>
                    <p className="text-4xl font-bold text-gold">{analytics.contracts.total}</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      {Object.entries(analytics.contracts.byStatus).map(([status, count]) => (
                        <span key={status} className="text-frosted-mint capitalize">
                          {status}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                    <h3 className="text-faded-copper text-sm mb-2">Total Messages</h3>
                    <p className="text-4xl font-bold text-gold">{analytics.messages.total}</p>
                    <p className="text-frosted-mint text-sm mt-1">Across all rooms</p>
                  </div>
                </div>

                {/* Memberships Breakdown */}
                <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gold mb-4">Memberships</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(analytics.memberships.byTier).map(([tier, count]) => (
                      <div key={tier} className="bg-midnight-violet p-4 rounded-lg">
                        <p className="text-faded-copper text-sm capitalize">{tier} Tier</p>
                        <p className="text-2xl font-bold text-frosted-mint">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gold mb-4">Recent Contracts</h2>
                    <div className="space-y-2">
                      {analytics.recentActivity.contracts.map((contract: any) => (
                        <div key={contract.id} className="bg-midnight-violet p-3 rounded-lg">
                          <p className="text-frosted-mint font-bold truncate">{contract.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-faded-copper text-xs capitalize">{contract.status}</span>
                            <span className="text-faded-copper text-xs">
                              {new Date(contract.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gold mb-4">Recent Messages</h2>
                    <div className="space-y-2">
                      {analytics.recentActivity.messages.map((message: any) => (
                        <div key={message.id} className="bg-midnight-violet p-3 rounded-lg">
                          <p className="text-frosted-mint text-sm truncate">{message.content}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-faded-copper text-xs">{message.username}</span>
                            <span className="text-faded-copper text-xs">{message.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gold">User Management</h1>
              <div className="text-faded-copper">
                {usersPagination.total} total users
              </div>
            </div>

            {usersLoading ? (
              <SkeletonTable rows={10} />
            ) : (
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-midnight-violet">
                      <tr>
                        <th className="px-4 py-3 text-left text-gold">Email</th>
                        <th className="px-4 py-3 text-left text-gold">Wallet</th>
                        <th className="px-4 py-3 text-left text-gold">Admin</th>
                        <th className="px-4 py-3 text-left text-gold">Verified</th>
                        <th className="px-4 py-3 text-left text-gold">Contracts</th>
                        <th className="px-4 py-3 text-left text-gold">Messages</th>
                        <th className="px-4 py-3 text-left text-gold">Joined</th>
                        <th className="px-4 py-3 text-left text-gold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-faded-copper hover:bg-midnight-violet">
                          <td className="px-4 py-3 text-frosted-mint">{user.email}</td>
                          <td className="px-4 py-3 text-faded-copper text-xs font-mono">
                            {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '-'}
                          </td>
                          <td className="px-4 py-3">
                            {user.isAdmin ? (
                              <span className="text-gold">👑 Yes</span>
                            ) : (
                              <span className="text-faded-copper">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {user.emailVerified ? (
                              <span className="text-frosted-mint">✓</span>
                            ) : (
                              <span className="text-faded-copper">✗</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-frosted-mint">{user._count?.contracts || 0}</td>
                          <td className="px-4 py-3 text-frosted-mint">{user._count?.messages || 0}</td>
                          <td className="px-4 py-3 text-faded-copper text-xs">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePromoteAdmin(user.id, user.isAdmin)}
                                className="px-3 py-1 bg-clay-soil text-frosted-mint rounded hover:bg-gold hover:text-midnight-violet transition-colors text-xs"
                              >
                                {user.isAdmin ? 'Demote' : 'Promote'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="px-3 py-1 bg-clay-soil text-frosted-mint rounded hover:bg-red-600 transition-colors text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {usersPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 p-4 bg-midnight-violet">
                    {Array.from({ length: usersPagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchUsers(page)}
                        className={`px-3 py-1 rounded ${
                          page === usersPagination.page
                            ? 'bg-gold text-midnight-violet'
                            : 'bg-shadow-grey text-frosted-mint hover:bg-faded-copper'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gold">Contract Management</h1>
              <div className="text-faded-copper">
                {contractsPagination.total} total contracts
              </div>
            </div>

            {contractsLoading ? (
              <SkeletonTable rows={10} />
            ) : (
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-midnight-violet">
                      <tr>
                        <th className="px-4 py-3 text-left text-gold">Title</th>
                        <th className="px-4 py-3 text-left text-gold">Owner</th>
                        <th className="px-4 py-3 text-left text-gold">Status</th>
                        <th className="px-4 py-3 text-left text-gold">Created</th>
                        <th className="px-4 py-3 text-left text-gold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr key={contract.id} className="border-t border-faded-copper hover:bg-midnight-violet">
                          <td className="px-4 py-3 text-frosted-mint font-bold">{contract.title}</td>
                          <td className="px-4 py-3 text-faded-copper text-xs">
                            {contract.user?.email || `${contract.walletAddress.slice(0, 6)}...${contract.walletAddress.slice(-4)}`}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={contract.status}
                              onChange={(e) => handleUpdateContractStatus(contract.id, e.target.value)}
                              className="px-2 py-1 bg-midnight-violet text-frosted-mint border border-faded-copper rounded text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="pending">Pending</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-faded-copper text-xs">
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteContract(contract.id, contract.title)}
                              className="px-3 py-1 bg-clay-soil text-frosted-mint rounded hover:bg-red-600 transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {contractsPagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 p-4 bg-midnight-violet">
                    {Array.from({ length: contractsPagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchContracts(page)}
                        className={`px-3 py-1 rounded ${
                          page === contractsPagination.page
                            ? 'bg-gold text-midnight-violet'
                            : 'bg-shadow-grey text-frosted-mint hover:bg-faded-copper'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
