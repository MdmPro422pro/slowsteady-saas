import { useState } from 'react';
import { Contract, ContractUser, ContractMilestone } from '../types/contract';

interface ContractManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onSave: (contract: Contract) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ContractManagementModal({
  isOpen,
  onClose,
  contract,
  onSave,
  mode,
}: ContractManagementModalProps) {
  const [formData, setFormData] = useState<Partial<Contract>>(
    contract || {
      contractName: '',
      clientCompany: '',
      contractType: 'Custom',
      status: 'Pending',
      value: 0,
      depositPaid: 0,
      balanceDue: 0,
      description: '',
      blockchainNetwork: 'Ethereum',
      authorizedUsers: [],
      milestones: [],
      documents: [],
      notes: '',
    }
  );

  const [activeTab, setActiveTab] = useState<'details' | 'users' | 'milestones' | 'documents'>('details');
  const [newUser, setNewUser] = useState<Partial<ContractUser>>({});
  const [newMilestone, setNewMilestone] = useState<Partial<ContractMilestone>>({});

  if (!isOpen) return null;

  const handleSave = () => {
    const contractToSave: Contract = {
      id: contract?.id || `contract_${Date.now()}`,
      contractName: formData.contractName || '',
      clientCompany: formData.clientCompany || '',
      contractType: formData.contractType || 'Custom',
      status: formData.status || 'Pending',
      createdDate: contract?.createdDate || new Date().toISOString(),
      startDate: formData.startDate || new Date().toISOString(),
      endDate: formData.endDate,
      value: formData.value || 0,
      depositPaid: formData.depositPaid || 0,
      balanceDue: (formData.value || 0) - (formData.depositPaid || 0),
      description: formData.description || '',
      blockchainNetwork: formData.blockchainNetwork || 'Ethereum',
      contractAddress: formData.contractAddress,
      deploymentDate: formData.deploymentDate,
      authorizedUsers: formData.authorizedUsers || [],
      milestones: formData.milestones || [],
      documents: formData.documents || [],
      notes: formData.notes || '',
    };

    onSave(contractToSave);
    onClose();
  };

  const addUser = () => {
    if (newUser.email && newUser.name) {
      const user: ContractUser = {
        id: `user_${Date.now()}`,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role || 'Team Member',
        company: formData.clientCompany || '',
        accessLevel: newUser.accessLevel || 'Read Only',
        addedDate: new Date().toISOString(),
        addedBy: 'Admin',
        isActive: true,
      };

      setFormData({
        ...formData,
        authorizedUsers: [...(formData.authorizedUsers || []), user],
      });

      setNewUser({});
    }
  };

  const removeUser = (userId: string) => {
    setFormData({
      ...formData,
      authorizedUsers: (formData.authorizedUsers || []).filter(u => u.id !== userId),
    });
  };

  const toggleUserAccess = (userId: string) => {
    setFormData({
      ...formData,
      authorizedUsers: (formData.authorizedUsers || []).map(u =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ),
    });
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      const milestone: ContractMilestone = {
        id: `milestone_${Date.now()}`,
        title: newMilestone.title,
        description: newMilestone.description || '',
        dueDate: newMilestone.dueDate,
        status: 'Pending',
        paymentAmount: newMilestone.paymentAmount,
      };

      setFormData({
        ...formData,
        milestones: [...(formData.milestones || []), milestone],
      });

      setNewMilestone({});
    }
  };

  const updateMilestoneStatus = (milestoneId: string, status: ContractMilestone['status']) => {
    setFormData({
      ...formData,
      milestones: (formData.milestones || []).map(m =>
        m.id === milestoneId
          ? {
              ...m,
              status,
              completedDate: status === 'Completed' ? new Date().toISOString() : m.completedDate,
            }
          : m
      ),
    });
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-midnight-violet border-2 border-gold rounded-lg max-w-6xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-frosted-mint hover:text-gold text-3xl z-10"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gold mb-2">
            {mode === 'create' ? '📄 New Contract' : mode === 'edit' ? '✏️ Edit Contract' : '👁️ View Contract'}
          </h2>
          <p className="text-faded-copper">
            {mode === 'create' ? 'Create a new smart contract project' : 'Manage contract details and access'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'details', label: 'Contract Details', icon: '📋' },
            { id: 'users', label: 'Authorized Users', icon: '👥' },
            { id: 'milestones', label: 'Milestones', icon: '🎯' },
            { id: 'documents', label: 'Documents', icon: '📎' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold text-shadow-grey'
                  : 'bg-shadow-grey text-frosted-mint hover:bg-clay-soil'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto mb-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Contract Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contractName}
                    onChange={e => setFormData({ ...formData, contractName: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                    placeholder="e.g., DeFi Token Project"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Client Company *
                  </label>
                  <input
                    type="text"
                    value={formData.clientCompany}
                    onChange={e => setFormData({ ...formData, clientCompany: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Contract Type
                  </label>
                  <select
                    value={formData.contractType}
                    onChange={e => setFormData({ ...formData, contractType: e.target.value as any })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  >
                    <option value="ERC-20">ERC-20 (Fungible Token)</option>
                    <option value="ERC-721">ERC-721 (NFT)</option>
                    <option value="ERC-1155">ERC-1155 (Multi-Token)</option>
                    <option value="ERC-777">ERC-777 (Advanced Token)</option>
                    <option value="ERC-998">ERC-998 (Composable NFT)</option>
                    <option value="Custom">Custom Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Contract Value (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Deposit Paid (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.depositPaid}
                    onChange={e => setFormData({ ...formData, depositPaid: parseFloat(e.target.value) || 0 })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate?.split('T')[0]}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate?.split('T')[0] || ''}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Blockchain Network
                  </label>
                  <input
                    type="text"
                    value={formData.blockchainNetwork}
                    onChange={e => setFormData({ ...formData, blockchainNetwork: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                    placeholder="e.g., Ethereum, Polygon, BSC"
                  />
                </div>

                <div>
                  <label className="block text-frosted-mint text-sm font-semibold mb-2">
                    Contract Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.contractAddress || ''}
                    onChange={e => setFormData({ ...formData, contractAddress: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                    placeholder="0x..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-frosted-mint text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  placeholder="Contract description and requirements"
                />
              </div>

              <div>
                <label className="block text-frosted-mint text-sm font-semibold mb-2">
                  Internal Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-shadow-grey border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none disabled:opacity-50"
                  placeholder="Private notes (not visible to client)"
                />
              </div>

              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                <div className="text-gold font-semibold mb-2">Financial Summary</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-faded-copper text-sm">Total Value</div>
                    <div className="text-gold text-xl font-bold">${formData.value?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-faded-copper text-sm">Paid</div>
                    <div className="text-gold text-xl font-bold">${formData.depositPaid?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-faded-copper text-sm">Balance Due</div>
                    <div className="text-gold text-xl font-bold">
                      ${((formData.value || 0) - (formData.depositPaid || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authorized Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {!isReadOnly && (
                <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                  <h3 className="text-gold font-semibold mb-3">Add Authorized User</h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    <input
                      type="email"
                      placeholder="Email *"
                      value={newUser.email || ''}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Name *"
                      value={newUser.name || ''}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={newUser.role || ''}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <select
                      value={newUser.accessLevel || 'Read Only'}
                      onChange={e => setNewUser({ ...newUser, accessLevel: e.target.value as any })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    >
                      <option value="Read Only">Read Only</option>
                      <option value="Limited">Limited</option>
                      <option value="Full">Full Access</option>
                    </select>
                  </div>
                  <button
                    onClick={addUser}
                    className="mt-3 px-4 py-2 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
                  >
                    Add User
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {(formData.authorizedUsers || []).length === 0 ? (
                  <div className="text-center py-8 text-frosted-mint">
                    No authorized users yet
                  </div>
                ) : (
                  (formData.authorizedUsers || []).map(user => (
                    <div
                      key={user.id}
                      className={`bg-shadow-grey border-2 border-faded-copper rounded-lg p-4 ${
                        !user.isActive ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-gold font-semibold">{user.name}</div>
                            {!user.isActive && (
                              <span className="text-xs bg-clay-soil px-2 py-1 rounded text-frosted-mint">
                                Access Revoked
                              </span>
                            )}
                          </div>
                          <div className="text-frosted-mint text-sm">{user.email}</div>
                          <div className="text-faded-copper text-xs mt-1">
                            {user.role} • {user.accessLevel} • Added {new Date(user.addedDate).toLocaleDateString()}
                          </div>
                        </div>
                        {!isReadOnly && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleUserAccess(user.id)}
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                user.isActive
                                  ? 'bg-clay-soil text-frosted-mint hover:bg-faded-copper'
                                  : 'bg-gold text-shadow-grey hover:bg-faded-copper'
                              }`}
                            >
                              {user.isActive ? 'Revoke' : 'Restore'}
                            </button>
                            <button
                              onClick={() => removeUser(user.id)}
                              className="px-3 py-1 rounded bg-clay-soil text-frosted-mint hover:bg-faded-copper text-sm font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {!isReadOnly && (
                <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                  <h3 className="text-gold font-semibold mb-3">Add Milestone</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Milestone Title *"
                      value={newMilestone.title || ''}
                      onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <input
                      type="date"
                      value={newMilestone.dueDate || ''}
                      onChange={e => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Payment Amount (optional)"
                      value={newMilestone.paymentAmount || ''}
                      onChange={e =>
                        setNewMilestone({ ...newMilestone, paymentAmount: parseFloat(e.target.value) || 0 })
                      }
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newMilestone.description || ''}
                      onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-midnight-violet border-2 border-faded-copper text-frosted-mint focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={addMilestone}
                    className="mt-3 px-4 py-2 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
                  >
                    Add Milestone
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {(formData.milestones || []).length === 0 ? (
                  <div className="text-center py-8 text-frosted-mint">No milestones defined</div>
                ) : (
                  (formData.milestones || []).map(milestone => (
                    <div key={milestone.id} className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-gold font-semibold">{milestone.title}</div>
                          <div className="text-frosted-mint text-sm">{milestone.description}</div>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            milestone.status === 'Completed'
                              ? 'bg-gold text-shadow-grey'
                              : milestone.status === 'In Progress'
                              ? 'bg-faded-copper text-shadow-grey'
                              : milestone.status === 'Delayed'
                              ? 'bg-clay-soil text-frosted-mint'
                              : 'bg-shadow-grey text-frosted-mint'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      <div className="text-faded-copper text-xs">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        {milestone.paymentAmount && ` • Payment: $${milestone.paymentAmount.toLocaleString()}`}
                        {milestone.completedDate &&
                          ` • Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`}
                      </div>
                      {!isReadOnly && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateMilestoneStatus(milestone.id, 'In Progress')}
                            className="px-3 py-1 rounded bg-faded-copper text-shadow-grey text-xs font-semibold"
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => updateMilestoneStatus(milestone.id, 'Completed')}
                            className="px-3 py-1 rounded bg-gold text-shadow-grey text-xs font-semibold"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateMilestoneStatus(milestone.id, 'Delayed')}
                            className="px-3 py-1 rounded bg-clay-soil text-frosted-mint text-xs font-semibold"
                          >
                            Delayed
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="bg-shadow-grey border-2 border-faded-copper rounded-lg p-8 text-center">
                <div className="text-5xl mb-3">📎</div>
                <div className="text-gold font-semibold mb-2">Document Management</div>
                <div className="text-frosted-mint text-sm">
                  Document upload functionality will be connected to backend storage
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end border-t-2 border-faded-copper pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-shadow-grey text-frosted-mint font-semibold hover:bg-clay-soil transition-colors"
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-gold text-shadow-grey font-semibold hover:bg-faded-copper transition-colors"
            >
              {mode === 'create' ? 'Create Contract' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
