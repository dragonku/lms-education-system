import { UserRepository } from '../../../domain/repositories/UserRepository';
import { LoginDTO, AuthResponseDTO } from '../../dto/UserDTO';
import { UserStatus } from '../../../domain/entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string = process.env.JWT_SECRET || 'default-secret'
  ) {}

  async execute(loginData: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is not active. Please contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
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
      token,
      refreshToken,
    };
  }
}