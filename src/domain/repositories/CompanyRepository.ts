import { Company, CompanyStatus, CompanyContract } from '../entities/Company';

export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByBusinessNumber(businessNumber: string): Promise<Company | null>;
  findByStatus(status: CompanyStatus): Promise<Company[]>;
  create(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company>;
  update(id: string, company: Partial<Company>): Promise<Company>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ companies: Company[]; total: number }>;
  searchByName(name: string): Promise<Company[]>;
  updateStatus(id: string, status: CompanyStatus): Promise<Company>;
}

export interface CompanyContractRepository {
  findById(id: string): Promise<CompanyContract | null>;
  findByCompanyId(companyId: string): Promise<CompanyContract[]>;
  findActiveContracts(): Promise<CompanyContract[]>;
  create(contract: Omit<CompanyContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyContract>;
  update(id: string, contract: Partial<CompanyContract>): Promise<CompanyContract>;
  delete(id: string): Promise<void>;
}