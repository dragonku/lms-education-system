import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserType } from '../../domain/entities/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    userType: UserType;
  };
}

export class AuthMiddleware {
  private jwtSecret: string;

  constructor(jwtSecret: string = process.env.JWT_SECRET || 'default-secret') {
    this.jwtSecret = jwtSecret;
  }

  authenticate() {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, this.jwtSecret) as any;
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          userType: decoded.userType,
        };
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }

  authorize(requiredUserTypes: UserType[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!requiredUserTypes.includes(req.user.userType)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }
}