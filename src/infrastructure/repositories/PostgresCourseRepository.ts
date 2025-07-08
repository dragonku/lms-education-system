import { CourseRepository } from '../../domain/repositories/CourseRepository';
import { Course, CourseStatus, CourseType } from '../../domain/entities/Course';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { v4 as uuidv4 } from 'uuid';

export class PostgresCourseRepository implements CourseRepository {
  constructor(private db: DatabaseConnection) {}

  async findById(id: string): Promise<Course | null> {
    const result = await this.db.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByStatus(status: CourseStatus): Promise<Course[]> {
    const result = await this.db.query(
      'SELECT * FROM courses WHERE status = $1',
      [status]
    );
    return result.rows;
  }

  async findByType(courseType: CourseType): Promise<Course[]> {
    const result = await this.db.query(
      'SELECT * FROM courses WHERE course_type = $1',
      [courseType]
    );
    return result.rows;
  }

  async findByCategory(category: string): Promise<Course[]> {
    const result = await this.db.query(
      'SELECT * FROM courses WHERE category = $1',
      [category]
    );
    return result.rows;
  }

  async create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const id = uuidv4();
    const now = new Date();
    
    const result = await this.db.query(
      `INSERT INTO courses (
        id, title, description, objectives, target_audience, prerequisites, 
        duration, max_students, min_students, course_type, status, 
        category, tags, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        id, course.title, course.description, JSON.stringify(course.objectives),
        course.targetAudience, JSON.stringify(course.prerequisites), course.duration,
        course.maxStudents, course.minStudents, course.courseType, course.status,
        course.category, JSON.stringify(course.tags), course.createdBy, now, now
      ]
    );
    
    return this.mapRowToCourse(result.rows[0]);
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(course).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt') {
        const dbKey = this.camelToSnake(key);
        if (key === 'objectives' || key === 'prerequisites' || key === 'tags') {
          fields.push(`${dbKey} = $${paramIndex++}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${dbKey} = $${paramIndex++}`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(id);

    const result = await this.db.query(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return this.mapRowToCourse(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM courses WHERE id = $1', [id]);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ courses: Course[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const [coursesResult, countResult] = await Promise.all([
      this.db.query(
        'SELECT * FROM courses ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      ),
      this.db.query('SELECT COUNT(*) FROM courses')
    ]);

    return {
      courses: coursesResult.rows.map(row => this.mapRowToCourse(row)),
      total: parseInt(countResult.rows[0].count)
    };
  }

  async searchByTitle(title: string): Promise<Course[]> {
    const result = await this.db.query(
      'SELECT * FROM courses WHERE title ILIKE $1',
      [`%${title}%`]
    );
    return result.rows.map(row => this.mapRowToCourse(row));
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    const result = await this.db.query(
      `SELECT DISTINCT c.* FROM courses c
       JOIN course_sessions cs ON c.id = cs.course_id
       WHERE cs.instructor_id = $1`,
      [instructorId]
    );
    return result.rows.map(row => this.mapRowToCourse(row));
  }

  private mapRowToCourse(row: any): Course {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      objectives: JSON.parse(row.objectives || '[]'),
      targetAudience: row.target_audience,
      prerequisites: JSON.parse(row.prerequisites || '[]'),
      duration: row.duration,
      maxStudents: row.max_students,
      minStudents: row.min_students,
      courseType: row.course_type,
      status: row.status,
      category: row.category,
      tags: JSON.parse(row.tags || '[]'),
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}