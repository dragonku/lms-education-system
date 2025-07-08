import { CreateCourseUseCase } from '../../src/application/use-cases/course/CreateCourseUseCase';
import { CourseRepository } from '../../src/domain/repositories/CourseRepository';
import { Course, CourseType, CourseStatus } from '../../src/domain/entities/Course';
import { CreateCourseDTO } from '../../src/application/dto/CourseDTO';

describe('CreateCourseUseCase', () => {
  let createCourseUseCase: CreateCourseUseCase;
  let mockCourseRepository: jest.Mocked<CourseRepository>;

  beforeEach(() => {
    mockCourseRepository = {
      findById: jest.fn(),
      findByStatus: jest.fn(),
      findByType: jest.fn(),
      findByCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      searchByTitle: jest.fn(),
      findByInstructor: jest.fn(),
    };

    createCourseUseCase = new CreateCourseUseCase(mockCourseRepository);
  });

  describe('execute', () => {
    it('should create course with valid data', async () => {
      // Given
      const courseData: CreateCourseDTO = {
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        objectives: ['Understand programming concepts', 'Write basic code'],
        targetAudience: 'Beginners',
        prerequisites: ['Basic computer skills'],
        duration: 40,
        maxStudents: 20,
        minStudents: 5,
        courseType: CourseType.GENERAL,
        category: 'Programming',
        tags: ['programming', 'beginner'],
      };

      const createdBy = 'admin-123';

      const expectedCourse: Course = {
        id: 'course-123',
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCourseRepository.create.mockResolvedValue(expectedCourse);

      // When
      const result = await createCourseUseCase.execute(courseData, createdBy);

      // Then
      expect(mockCourseRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
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
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: expectedCourse.id,
          title: expectedCourse.title,
          description: expectedCourse.description,
          courseType: expectedCourse.courseType,
          status: expectedCourse.status,
          createdBy: expectedCourse.createdBy,
        })
      );
    });

    it('should create course with employee training type', async () => {
      // Given
      const courseData: CreateCourseDTO = {
        title: 'Corporate Training',
        description: 'Training for employees',
        objectives: ['Improve skills'],
        targetAudience: 'Employees',
        duration: 20,
        maxStudents: 30,
        minStudents: 10,
        courseType: CourseType.EMPLOYEE_TRAINING,
        category: 'Corporate',
        tags: ['corporate', 'training'],
      };

      const createdBy = 'admin-123';

      mockCourseRepository.create.mockResolvedValue({
        id: 'course-456',
        ...courseData,
        status: CourseStatus.DRAFT,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // When
      const result = await createCourseUseCase.execute(courseData, createdBy);

      // Then
      expect(mockCourseRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          courseType: CourseType.EMPLOYEE_TRAINING,
          status: CourseStatus.DRAFT,
        })
      );
      expect(result.courseType).toBe(CourseType.EMPLOYEE_TRAINING);
      expect(result.status).toBe(CourseStatus.DRAFT);
    });

    it('should create course with job seeker training type', async () => {
      // Given
      const courseData: CreateCourseDTO = {
        title: 'Job Seeker Training',
        description: 'Training for job seekers',
        objectives: ['Find employment'],
        targetAudience: 'Job seekers',
        duration: 80,
        maxStudents: 15,
        minStudents: 8,
        courseType: CourseType.JOB_SEEKER_TRAINING,
        category: 'Employment',
        tags: ['employment', 'job-seeking'],
      };

      const createdBy = 'admin-123';

      mockCourseRepository.create.mockResolvedValue({
        id: 'course-789',
        ...courseData,
        status: CourseStatus.DRAFT,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // When
      const result = await createCourseUseCase.execute(courseData, createdBy);

      // Then
      expect(result.courseType).toBe(CourseType.JOB_SEEKER_TRAINING);
      expect(result.category).toBe('Employment');
    });
  });
});