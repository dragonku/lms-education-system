import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DatabaseConnection } from './infrastructure/database/DatabaseConnection';
import { PostgresUserRepository } from './infrastructure/repositories/PostgresUserRepository';
import { PostgresCourseRepository } from './infrastructure/repositories/PostgresCourseRepository';
import { CreateUserUseCase } from './application/use-cases/user/CreateUserUseCase';
import { LoginUserUseCase } from './application/use-cases/user/LoginUserUseCase';
import { CreateCourseUseCase } from './application/use-cases/course/CreateCourseUseCase';
import { UserController } from './presentation/controllers/UserController';
import { CourseController } from './presentation/controllers/CourseController';
import { AuthMiddleware } from './presentation/middleware/AuthMiddleware';
import { createUserRoutes } from './presentation/routes/UserRoutes';
import { createCourseRoutes } from './presentation/routes/CourseRoutes';

export class App {
  private app: express.Application;
  private db: DatabaseConnection;

  constructor() {
    this.app = express();
    this.db = new DatabaseConnection();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    const userRepository = new PostgresUserRepository(this.db);
    const courseRepository = new PostgresCourseRepository(this.db);
    
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const loginUserUseCase = new LoginUserUseCase(userRepository);
    const createCourseUseCase = new CreateCourseUseCase(courseRepository);
    
    const userController = new UserController(createUserUseCase, loginUserUseCase);
    const courseController = new CourseController(createCourseUseCase, courseRepository);
    
    const authMiddleware = new AuthMiddleware();
    
    this.app.use('/api/users', createUserRoutes(userController, authMiddleware));
    this.app.use('/api/courses', createCourseRoutes(courseController, authMiddleware));
    
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await this.db.close();
  }
}