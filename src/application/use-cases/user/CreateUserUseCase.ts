import { UserRepository } from '../../../domain/repositories/UserRepository';
import { CreateUserDTO, UserResponseDTO } from '../../dto/UserDTO';
import { User, UserStatus } from '../../../domain/entities/User';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      userType: userData.userType,
      status: UserStatus.PENDING_APPROVAL,
      companyId: userData.companyId,
    };

    const createdUser = await this.userRepository.create(user);
    
    return {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      phoneNumber: createdUser.phoneNumber,
      userType: createdUser.userType,
      status: createdUser.status,
      companyId: createdUser.companyId,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }
}