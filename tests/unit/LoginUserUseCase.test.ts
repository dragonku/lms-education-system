import { LoginUserUseCase } from '../../src/application/use-cases/user/LoginUserUseCase';
import { UserRepository } from '../../src/domain/repositories/UserRepository';
import { User, UserType, UserStatus } from '../../src/domain/entities/User';
import { LoginDTO } from '../../src/application/dto/UserDTO';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByType: jest.fn(),
      findByStatus: jest.fn(),
      findByCompanyId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      searchByName: jest.fn(),
      updateStatus: jest.fn(),
    };

    loginUserUseCase = new LoginUserUseCase(mockUserRepository, 'test-secret');
  });

  describe('execute', () => {
    it('should login user with valid credentials', async () => {
      // Given
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user: User = {
        id: 'user-123',
        email: loginData.email,
        password: 'hashed-password',
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
        status: UserStatus.ACTIVE,
        companyId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      // When
      const result = await loginUserUseCase.execute(loginData);

      // Then
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.password);
      expect(result).toEqual({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
          status: user.status,
          companyId: user.companyId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: 'mock-token',
        refreshToken: 'mock-token',
      });
    });

    it('should throw error when user not found', async () => {
      // Given
      const loginData: LoginDTO = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // When & Then
      await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      // Given
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const user: User = {
        id: 'user-123',
        email: loginData.email,
        password: 'hashed-password',
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
        status: UserStatus.ACTIVE,
        companyId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      // When & Then
      await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error when user is not active', async () => {
      // Given
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user: User = {
        id: 'user-123',
        email: loginData.email,
        password: 'hashed-password',
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
        status: UserStatus.PENDING_APPROVAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);

      // When & Then
      await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
        'Account is not active. Please contact administrator.'
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});