import { UserType, UserStatus } from '../../domain/entities/User';

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  userType: UserType;
  companyId?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phoneNumber?: string;
  companyId?: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  userType: UserType;
  status: UserStatus;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
  refreshToken: string;
}

export interface UserFilterDTO {
  userType?: UserType;
  status?: UserStatus;
  companyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}