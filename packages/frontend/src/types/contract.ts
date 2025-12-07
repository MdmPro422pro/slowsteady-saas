export interface Contract {
  id: string;
  contractName: string;
  clientCompany: string;
  contractType: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'ERC-777' | 'ERC-998' | 'ERC-223' | 'ERC-827' | 'ERC-865' | 'ERC-1132' | 'Custom';
  status: 'Active' | 'Pending' | 'Completed' | 'Terminated' | 'On Hold';
  createdDate: string;
  startDate: string;
  endDate?: string;
  value: number; // Contract value in USD
  depositPaid: number;
  balanceDue: number;
  description: string;
  blockchainNetwork: string;
  contractAddress?: string;
  deploymentDate?: string;
  authorizedUsers: ContractUser[];
  milestones: ContractMilestone[];
  documents: ContractDocument[];
  notes: string;
}

export interface ContractUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  accessLevel: 'Full' | 'Read Only' | 'Limited';
  addedDate: string;
  addedBy: string;
  isActive: boolean;
}

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  paymentAmount?: number;
  completedDate?: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  type: 'Agreement' | 'Invoice' | 'Technical Spec' | 'Other';
  uploadDate: string;
  url: string;
  size: string;
}

export interface ContractActivity {
  id: string;
  contractId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}
