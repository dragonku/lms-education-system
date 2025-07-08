import { CourseRepository } from '../../../domain/repositories/CourseRepository';
import { CreateCourseDTO, CourseResponseDTO } from '../../dto/CourseDTO';
import { Course, CourseStatus } from '../../../domain/entities/Course';
import { v4 as uuidv4 } from 'uuid';

export class CreateCourseUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(courseData: CreateCourseDTO, createdBy: string): Promise<CourseResponseDTO> {
    const course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> = {
      title: courseData.title,
      description: courseData.description,
      objectives: courseData.objectives,
      targetAudience: courseData.targetAudience,
      prerequisites: courseData.prerequisites,
      duration: courseData.duration,
      maxStudents: courseData.maxStudents,
      minStudents: courseData.minStudents,
      courseType: courseData.courseType,
      status: CourseStatus.DRAFT,
      category: courseData.category,
      tags: courseData.tags,
      createdBy,
    };

    const createdCourse = await this.courseRepository.create(course);
    
    return {
      id: createdCourse.id,
      title: createdCourse.title,
      description: createdCourse.description,
      objectives: createdCourse.objectives,
      targetAudience: createdCourse.targetAudience,
      prerequisites: createdCourse.prerequisites,
      duration: createdCourse.duration,
      maxStudents: createdCourse.maxStudents,
      minStudents: createdCourse.minStudents,
      courseType: createdCourse.courseType,
      status: createdCourse.status,
      category: createdCourse.category,
      tags: createdCourse.tags,
      createdBy: createdCourse.createdBy,
      createdAt: createdCourse.createdAt,
      updatedAt: createdCourse.updatedAt,
    };
  }
}