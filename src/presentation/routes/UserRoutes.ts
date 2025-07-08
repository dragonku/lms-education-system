import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export function createUserRoutes(
  userController: UserController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.post('/register', userController.register.bind(userController));
  router.post('/login', userController.login.bind(userController));
  
  router.get('/profile', 
    authMiddleware.authenticate(),
    userController.getProfile.bind(userController)
  );
  
  router.put('/profile', 
    authMiddleware.authenticate(),
    userController.updateProfile.bind(userController)
  );

  return router;
}