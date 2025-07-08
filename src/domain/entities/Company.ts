export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval'
}

export interface Company {
  id: string;
  name: string;
  businessNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  description?: string;
  status: CompanyStatus;
  contractStartDate?: Date;
  contractEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyContract {
  id: string;
  companyId: string;
  contractNumber: string;
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  budget: number;
  terms: string;
  status: 'active' | 'expired' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}