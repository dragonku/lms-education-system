import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, UserType, UserStatus } from '../../domain/entities/User';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { v4 as uuidv4 } from 'uuid';

export class PostgresUserRepository implements UserRepository {
  constructor(private db: DatabaseConnection) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findByType(userType: UserType): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE user_type = $1',
      [userType]
    );
    return result.rows;
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE status = $1',
      [status]
    );
    return result.rows;
  }

  async findByCompanyId(companyId: string): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE company_id = $1',
      [companyId]
    );
    return result.rows;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    
    const result = await this.db.query(
      `INSERT INTO users (id, email, password, name, phone_number, user_type, status, company_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, user.email, user.password, user.name, user.phoneNumber, user.userType, user.status, user.companyId, now, now]
    );
    
    return result.rows[0];
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(user).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt') {
        fields.push(`${this.camelToSnake(key)} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(id);

    const result = await this.db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const [usersResult, countResult] = await Promise.all([
      this.db.query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      ),
      this.db.query('SELECT COUNT(*) FROM users')
    ]);

    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  async searchByName(name: string): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const result = await this.db.query(
      'UPDATE users SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [status, new Date(), id]
    );
    return result.rows[0];
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}