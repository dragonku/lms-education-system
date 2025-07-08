import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/user/CreateUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/user/LoginUserUseCase';
import { CreateUserDTO, LoginDTO } from '../../application/dto/UserDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { UserType } from '../../domain/entities/User';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      
      if (!userData.email || !userData.password || !userData.name) {
        res.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      const user = await this.createUserUseCase.execute(userData);
      res.status(201).json({
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDTO = req.body;
      
      if (!loginData.email || !loginData.password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const authResult = await this.loginUserUseCase.execute(loginData);
      res.json({
        message: 'Login successful',
        data: authResult
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.json({
        message: 'Profile retrieved successfully',
        data: req.user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      res.json({
        message: 'Profile update functionality not implemented yet'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}