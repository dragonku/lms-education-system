import { CreateUserUseCase } from '../../src/application/use-cases/user/CreateUserUseCase';
import { UserRepository } from '../../src/domain/repositories/UserRepository';
import { User, UserType, UserStatus } from '../../src/domain/entities/User';
import { CreateUserDTO } from '../../src/application/dto/UserDTO';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
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

    createUserUseCase = new CreateUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('should create user with valid data', async () => {
      // Given
      const userData: CreateUserDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
      };

      const expectedUser: User = {
        id: 'user-123',
        email: userData.email,
        password: 'hashed-password',
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType,
        status: UserStatus.PENDING_APPROVAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // When
      const result = await createUserUseCase.execute(userData);

      // Then
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          status: UserStatus.PENDING_APPROVAL,
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: expectedUser.id,
          email: expectedUser.email,
          name: expectedUser.name,
          userType: expectedUser.userType,
          status: expectedUser.status,
        })
      );
    });

    it('should throw error when user with email already exists', async () => {
      // Given
      const userData: CreateUserDTO = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
      };

      const existingUser: User = {
        id: 'existing-user',
        email: userData.email,
        password: 'hashed-password',
        name: 'Existing User',
        phoneNumber: '010-9876-5432',
        userType: UserType.STUDENT,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // When & Then
      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        'User with this email already exists'
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should create user with company assignment', async () => {
      // Given
      const userData: CreateUserDTO = {
        email: 'employee@company.com',
        password: 'password123',
        name: 'Jane Doe',
        phoneNumber: '010-1234-5678',
        userType: UserType.STUDENT,
        companyId: 'company-123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-456',
        ...userData,
        password: 'hashed-password',
        status: UserStatus.PENDING_APPROVAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // When
      const result = await createUserUseCase.execute(userData);

      // Then
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: userData.companyId,
        })
      );
      expect(result.companyId).toBe(userData.companyId);
    });
  });
});