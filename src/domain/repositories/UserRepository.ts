import { User, UserType, UserStatus } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByType(userType: UserType): Promise<User[]>;
  findByStatus(status: UserStatus): Promise<User[]>;
  findByCompanyId(companyId: string): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ users: User[]; total: number }>;
  searchByName(name: string): Promise<User[]>;
  updateStatus(id: string, status: UserStatus): Promise<User>;
}