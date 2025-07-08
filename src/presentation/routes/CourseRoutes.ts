import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { UserType } from '../../domain/entities/User';

export function createCourseRoutes(
  courseController: CourseController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.get('/', courseController.getCourses.bind(courseController));
  router.get('/:id', courseController.getCourseById.bind(courseController));
  
  router.post('/', 
    authMiddleware.authenticate(),
    authMiddleware.authorize([UserType.ADMIN]),
    courseController.createCourse.bind(courseController)
  );
  
  router.put('/:id', 
    authMiddleware.authenticate(),
    authMiddleware.authorize([UserType.ADMIN]),
    courseController.updateCourse.bind(courseController)
  );
  
  router.delete('/:id', 
    authMiddleware.authenticate(),
    authMiddleware.authorize([UserType.ADMIN]),
    courseController.deleteCourse.bind(courseController)
  );

  return router;
}