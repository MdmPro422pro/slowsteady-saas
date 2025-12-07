import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Contract } from '../types/contract';
import { ContractManagementModal } from '../components/ContractManagementModal';

export default function AdminMasterControl() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractModalMode, setContractModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [siteSettings, setSiteSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    chatEnabled: true,
    paymentsEnabled: true,
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/');
      return;
    }

    // Load mock data (in production, fetch from backend)
    loadAdminData();
  }, [navigate]);

  const loadAdminData = () => {
    // Load users
    const storedUsers = localStorage.getItem('registeredUsers') || '[]';
    setUsers(JSON.parse(storedUsers));

    // Load memberships
    const allMemberships = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('membershipTier')) {
        const membership = JSON.parse(localStorage.getItem(key) || '{}');
        allMemberships.push({ key, ...membership });
      }
    }
    setMemberships(allMemberships);

    // Load chat profiles
    const allMessages = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('chatProfile_')) {
        const profile = JSON.parse(localStorage.getItem(key) || '{}');
        allMessages.push({ walletAddress: key.replace('chatProfile_', ''), ...profile });
      }
    }
    setChatMessages(allMessages);

    // Load contracts
    const storedContracts = localStorage.getItem('contracts') || '[]';
    setContracts(JSON.parse(storedContracts));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const toggleSiteSetting = (setting: keyof typeof siteSettings) => {
    setSiteSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    // In production, sync with backend
    localStorage.setItem('siteSettings', JSON.stringify({
      ...siteSettings,
      [setting]: !siteSettings[setting],
    }));
  };

  const deleteUser = (email: string) => {
    if (window.confirm(`Are you sure you want to delete user: ${email}?`)) {
      const filtered = users.filter(u => u.email !== email);
      setUsers(filtered);
      localStorage.setItem('registeredUsers', JSON.stringify(filtered));
    }
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will clear ALL user data. Are you absolutely sure?')) {
      if (window.confirm('This action CANNOT be undone. Type "DELETE" to confirm.')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('All data cleared. You will be logged out.');
        navigate('/');
      }
    }
  };

  // Contract management functions
  const handleSaveContract = (contract: Contract) => {
    const existingIndex = contracts.findIndex(c => c.id === contract.id);
    let updatedContracts;

    if (existingIndex >= 0) {
      updatedContracts = [...contracts];
      updatedContracts[existingIndex] = contract;
    } else {
      updatedContracts = [...contracts, contract];
    }

    setContracts(updatedContracts);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
  };

  const openContractModal = (mode: 'create' | 'edit' | 'view', contract: Contract | null = null) => {
    setContractModalMode(mode);
    setSelectedContract(contract);
    setIsContractModalOpen(true);
  };

  const deleteContract = (contractId: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      const filtered = contracts.filter(c => c.id !== contractId);
      setContracts(filtered);
      localStorage.setItem('contracts', JSON.stringify(filtered));
    }
  };

  const terminateContract = (contractId: string) => {
    if (window.confirm('Are you sure you want to terminate this contract? This will set status to Terminated.')) {
      const updated = contracts.map(c =>
        c.id === contractId ? { ...c, status: 'Terminated' as const, endDate: new Date().toISOString() } : c
      );
      setContracts(updated);
      localStorage.setItem('contracts', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-shadow-grey text-frosted-mint">
      {/* Header */}
      <header className="bg-midnight-violet border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gold">🔐 Master Control Panel</h1>
            <p className="text-faded-copper text-sm">Full System Administrator Access</p>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="text-sm">
                <p className="text-frosted-mint">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-clay-soil text-frosted-mint hover:bg-faded-copper transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'contracts', label: 'Contracts', icon: '📄' },
            { id: 'memberships', label: 'Memberships', icon: '💎' },
            { id: 'chat', label: 'Chat Control', icon: '💬' },
            { id: 'payments', label: 'Payments', icon: '💳' },
            { id: 'settings', label: 'Site Settings', icon: '⚙️' },
            { id: 'system', label: 'System', icon: '🖥️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold text-shadow-grey'
                  : 'bg-midnight-violet text-frosted-mint hover:bg-clay-soil'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-gold mb-1">{users.length}</div>
                <div className="text-frosted-mint text-sm">Total Users</div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-6">
                <div className="text-4xl mb-2">💎</div>
                <div className="text-3xl font-bold text-gold mb-1">{memberships.length}</div>
                <div className="text-frosted-mint text-sm">Active Memberships</div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-6">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-3xl font-bold text-gold mb-1">{chatMessages.length}</div>
                <div className="text-frosted-mint text-sm">Chat Users</div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-6">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold text-gold mb-1">$0</div>
                <div className="text-frosted-mint text-sm">Total Revenue</div>
              </div>
            </div>

            <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-shadow-grey hover:bg-clay-soil rounded-lg text-left border-2 border-faded-copper transition-colors"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-gold font-semibold">Manage Users</div>
                  <div className="text-frosted-mint text-sm">View and control user accounts</div>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 bg-shadow-grey hover:bg-clay-soil rounded-lg text-left border-2 border-faded-copper transition-colors"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-gold font-semibold">Site Settings</div>
                  <div className="text-frosted-mint text-sm">Configure global settings</div>
                </button>
                <button
                  onClick={() => setActiveTab('system')}
                  className="p-4 bg-shadow-grey hover:bg-clay-soil rounded-lg text-left border-2 border-faded-copper transition-colors"
                >
                  <div className="text-2xl mb-2">🖥️</div>
                  <div className="text-gold font-semibold">System Control</div>
                  <div className="text-frosted-mint text-sm">Advanced system operations</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">User Management</h2>
            {users.length === 0 ? (
              <p className="text-frosted-mint text-center py-8">No registered users yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-faded-copper">
                      <th className="text-left py-3 px-4 text-gold">Email</th>
                      <th className="text-left py-3 px-4 text-gold">Type</th>
                      <th className="text-left py-3 px-4 text-gold">Registered</th>
                      <th className="text-left py-3 px-4 text-gold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={idx} className="border-b border-faded-copper">
                        <td className="py-3 px-4 text-frosted-mint">{user.email}</td>
                        <td className="py-3 px-4 text-frosted-mint">{user.userType || 'N/A'}</td>
                        <td className="py-3 px-4 text-frosted-mint">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteUser(user.email)}
                            className="px-3 py-1 rounded bg-clay-soil text-frosted-mint hover:bg-faded-copper text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gold">Contract Management</h2>
                <p className="text-frosted-mint text-sm">Manage client smart contracts and access</p>
              </div>
              <button
                onClick={() => openContractModal('create')}
                className="px-6 py-3 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
              >
                + New Contract
              </button>
            </div>

            {/* Contract Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-4">
                <div className="text-faded-copper text-sm mb-1">Total Contracts</div>
                <div className="text-gold text-2xl font-bold">{contracts.length}</div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-4">
                <div className="text-faded-copper text-sm mb-1">Active</div>
                <div className="text-gold text-2xl font-bold">
                  {contracts.filter(c => c.status === 'Active').length}
                </div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-4">
                <div className="text-faded-copper text-sm mb-1">Total Value</div>
                <div className="text-gold text-2xl font-bold">
                  ${contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-4">
                <div className="text-faded-copper text-sm mb-1">Balance Due</div>
                <div className="text-gold text-2xl font-bold">
                  ${contracts.reduce((sum, c) => sum + c.balanceDue, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Contracts List */}
            {contracts.length === 0 ? (
              <div className="bg-midnight-violet border-2 border-gold rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-gold font-semibold text-xl mb-2">No Contracts Yet</h3>
                <p className="text-frosted-mint mb-6">Create your first client contract to get started</p>
                <button
                  onClick={() => openContractModal('create')}
                  className="px-6 py-3 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
                >
                  Create Contract
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map(contract => (
                  <div
                    key={contract.id}
                    className="bg-midnight-violet border-2 border-faded-copper rounded-lg p-6 hover:border-gold transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gold">{contract.contractName}</h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              contract.status === 'Active'
                                ? 'bg-gold text-shadow-grey'
                                : contract.status === 'Completed'
                                ? 'bg-faded-copper text-shadow-grey'
                                : contract.status === 'Terminated'
                                ? 'bg-clay-soil text-frosted-mint'
                                : 'bg-shadow-grey text-frosted-mint'
                            }`}
                          >
                            {contract.status}
                          </span>
                        </div>
                        <div className="text-frosted-mint mb-1">
                          <span className="font-semibold">{contract.clientCompany}</span> • {contract.contractType}
                        </div>
                        <div className="text-faded-copper text-sm">
                          Created: {new Date(contract.createdDate).toLocaleDateString()} • 
                          {contract.contractAddress && ` Address: ${contract.contractAddress.slice(0, 10)}...`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gold font-bold text-xl">${contract.value.toLocaleString()}</div>
                        <div className="text-faded-copper text-sm">
                          Due: ${contract.balanceDue.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-shadow-grey rounded-lg p-3">
                        <div className="text-faded-copper text-xs mb-1">Authorized Users</div>
                        <div className="text-frosted-mint font-semibold">
                          {contract.authorizedUsers.filter(u => u.isActive).length} Active
                        </div>
                      </div>
                      <div className="bg-shadow-grey rounded-lg p-3">
                        <div className="text-faded-copper text-xs mb-1">Milestones</div>
                        <div className="text-frosted-mint font-semibold">
                          {contract.milestones.filter(m => m.status === 'Completed').length} / {contract.milestones.length}
                        </div>
                      </div>
                      <div className="bg-shadow-grey rounded-lg p-3">
                        <div className="text-faded-copper text-xs mb-1">Network</div>
                        <div className="text-frosted-mint font-semibold">{contract.blockchainNetwork}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openContractModal('view', contract)}
                        className="px-4 py-2 rounded-lg bg-shadow-grey text-frosted-mint hover:bg-clay-soil transition-colors text-sm font-semibold"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => openContractModal('edit', contract)}
                        className="px-4 py-2 rounded-lg bg-faded-copper text-shadow-grey hover:bg-gold transition-colors text-sm font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      {contract.status === 'Active' && (
                        <button
                          onClick={() => terminateContract(contract.id)}
                          className="px-4 py-2 rounded-lg bg-clay-soil text-frosted-mint hover:bg-faded-copper transition-colors text-sm font-semibold"
                        >
                          ⚠️ Terminate
                        </button>
                      )}
                      <button
                        onClick={() => deleteContract(contract.id)}
                        className="px-4 py-2 rounded-lg bg-clay-soil text-frosted-mint hover:bg-faded-copper transition-colors text-sm font-semibold ml-auto"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Memberships Tab */}
        {activeTab === 'memberships' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Membership Control</h2>
            {memberships.length === 0 ? (
              <p className="text-frosted-mint text-center py-8">No active memberships</p>
            ) : (
              <div className="space-y-4">
                {memberships.map((membership, idx) => (
                  <div key={idx} className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gold font-semibold">{membership.name} - ${membership.price}/month</div>
                        <div className="text-frosted-mint text-sm">Level {membership.level}</div>
                      </div>
                      <button className="px-4 py-2 rounded bg-clay-soil text-frosted-mint hover:bg-faded-copper text-sm">
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Control Tab */}
        {activeTab === 'chat' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Chat Control Center</h2>
            <div className="space-y-4">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                <h3 className="text-gold font-semibold mb-2">Chat Users ({chatMessages.length})</h3>
                {chatMessages.length === 0 ? (
                  <p className="text-frosted-mint text-sm">No chat users yet</p>
                ) : (
                  <div className="space-y-2">
                    {chatMessages.map((user, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-faded-copper">
                        <div>
                          <div className="text-frosted-mint font-semibold">{user.username || 'Anonymous'}</div>
                          <div className="text-faded-copper text-xs">{user.walletAddress.slice(0, 10)}...</div>
                        </div>
                        <button className="px-3 py-1 rounded bg-clay-soil text-frosted-mint hover:bg-faded-copper text-sm">
                          Ban
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-4">Payment Control</h2>
            <div className="space-y-4">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                <h3 className="text-gold font-semibold mb-2">Payment Overview</h3>
                <p className="text-frosted-mint text-sm mb-4">Monitor all transactions and payment activities</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-midnight-violet rounded p-3">
                    <div className="text-faded-copper text-sm">Total Transactions</div>
                    <div className="text-gold text-2xl font-bold">0</div>
                  </div>
                  <div className="bg-midnight-violet rounded p-3">
                    <div className="text-faded-copper text-sm">Revenue (USD)</div>
                    <div className="text-gold text-2xl font-bold">$0.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-6">Site Settings</h2>
            <div className="space-y-4">
              {[
                { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Enable to prevent access to the site' },
                { key: 'registrationEnabled', label: 'User Registration', description: 'Allow new users to register' },
                { key: 'chatEnabled', label: 'Chat System', description: 'Enable/disable community chat' },
                { key: 'paymentsEnabled', label: 'Payment Processing', description: 'Enable/disable all payments' },
              ].map(setting => (
                <div key={setting.key} className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="text-gold font-semibold">{setting.label}</div>
                    <div className="text-frosted-mint text-sm">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => toggleSiteSetting(setting.key as keyof typeof siteSettings)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      siteSettings[setting.key as keyof typeof siteSettings]
                        ? 'bg-gold text-shadow-grey'
                        : 'bg-clay-soil text-frosted-mint'
                    }`}
                  >
                    {siteSettings[setting.key as keyof typeof siteSettings] ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="bg-midnight-violet border-2 border-gold rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gold mb-6">System Control</h2>
            <div className="space-y-4">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-gold font-semibold mb-2 text-lg">⚠️ Danger Zone</h3>
                <p className="text-frosted-mint text-sm mb-4">Irreversible actions that affect the entire system</p>
                <div className="space-y-3">
                  <button
                    onClick={clearAllData}
                    className="w-full px-6 py-3 rounded-lg bg-clay-soil text-frosted-mint hover:bg-faded-copper font-semibold transition-colors"
                  >
                    🗑️ Clear All User Data
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full px-6 py-3 rounded-lg bg-clay-soil text-frosted-mint hover:bg-faded-copper font-semibold transition-colors"
                  >
                    🔄 Reset Application
                  </button>
                </div>
              </div>

              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-6">
                <h3 className="text-gold font-semibold mb-2 text-lg">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-faded-copper">
                    <span className="text-frosted-mint">Platform:</span>
                    <span className="text-gold">Web Application</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-faded-copper">
                    <span className="text-frosted-mint">Storage Used:</span>
                    <span className="text-gold">{Object.keys(localStorage).length} items</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-frosted-mint">Admin Session:</span>
                    <span className="text-gold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contract Management Modal */}
      <ContractManagementModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        contract={selectedContract}
        onSave={handleSaveContract}
        mode={contractModalMode}
      />
    </div>
  );
}
