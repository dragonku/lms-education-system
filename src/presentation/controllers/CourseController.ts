import { Request, Response } from 'express';
import { CreateCourseUseCase } from '../../application/use-cases/course/CreateCourseUseCase';
import { CreateCourseDTO } from '../../application/dto/CourseDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';
import { CourseRepository } from '../../domain/repositories/CourseRepository';

export class CourseController {
  constructor(
    private createCourseUseCase: CreateCourseUseCase,
    private courseRepository: CourseRepository
  ) {}

  async createCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courseData: CreateCourseDTO = req.body;
      
      if (!courseData.title || !courseData.description) {
        res.status(400).json({ error: 'Title and description are required' });
        return;
      }

      const course = await this.createCourseUseCase.execute(courseData, req.user!.userId);
      res.status(201).json({
        message: 'Course created successfully',
        data: course
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.courseRepository.findAll(page, limit);
      res.json({
        message: 'Courses retrieved successfully',
        data: result.courses,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.courseRepository.findById(id);
      
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      res.json({
        message: 'Course retrieved successfully',
        data: course
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const course = await this.courseRepository.findById(id);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const updatedCourse = await this.courseRepository.update(id, updateData);
      res.json({
        message: 'Course updated successfully',
        data: updatedCourse
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const course = await this.courseRepository.findById(id);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      await this.courseRepository.delete(id);
      res.json({
        message: 'Course deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}