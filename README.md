# LMS (Learning Management System)

A comprehensive Learning Management System built with Clean Architecture principles, following TDD methodology.

## 🏗️ Architecture

This project implements Clean Architecture with the following layers:

- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Application Layer**: Use cases and DTOs
- **Infrastructure Layer**: Database implementations and external service integrations
- **Presentation Layer**: Controllers, middleware, and API routes

## 🚀 Features

Based on the PRD requirements, the system supports:

### Core Features
- User management (Admin, Instructor, Student, Company Partner)
- Course management with sessions and modules
- Enrollment system with approval workflow
- Assessment and testing functionality
- Board system (Notice, QnA, FAQ)
- Survey system with various question types
- Company partnership management

### User Types
- **Admin**: Full system management access
- **Instructor**: Course delivery and student management
- **Student**: Course enrollment and learning
- **Company Partner**: Employee training management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Styled Components, React Router
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL 14+
- **Authentication**: JWT tokens with role-based access control
- **Testing**: Jest with >80% coverage
- **Architecture**: Clean Architecture (4-layer)
- **Methodology**: TDD (Test-Driven Development)
- **Deployment**: Vercel (Frontend), Vercel/Railway (Backend)
- **CI/CD**: GitHub Actions

## 📋 Requirements

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd lms
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and JWT configurations
```

4. Set up database
```bash
# Create database
createdb lms

# Run migrations (when available)
npm run migrate
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏃‍♂️ Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📚 API Documentation

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Health Check
- `GET /api/health` - System health check

## 🗂️ Project Structure

```
src/
├── domain/
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/
│   ├── use-cases/         # Business use cases
│   └── dto/               # Data Transfer Objects
├── infrastructure/
│   ├── database/          # Database connections and migrations
│   ├── repositories/      # Repository implementations
│   └── external-apis/     # External service integrations
└── presentation/
    ├── controllers/       # API controllers
    ├── middleware/        # Express middleware
    └── routes/            # API routes

tests/
├── unit/                  # Unit tests
├── integration/           # Integration tests
└── e2e/                   # End-to-end tests
```

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Helmet security headers

## 🚀 Live Demo

**🌐 Frontend**: https://lms-education-system.vercel.app
**📊 GitHub**: https://github.com/dragonku/lms-education-system

### Test Accounts
```bash
# Admin Account (API)
curl -X POST https://api.example.com/users/register \
  -d '{"email":"admin@lms.com","password":"admin123","name":"관리자","userType":"admin"}'

# Student Account (Web)
Visit /register and create a student account
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [coding standards](CONTRIBUTING.md#coding-standards)
4. Write tests and ensure >80% coverage
5. Submit a pull request

### Development Guidelines
- Follow Clean Architecture principles
- Write tests first (TDD approach)
- Use TypeScript for type safety
- Follow conventional commit messages
- Update documentation as needed

## 🐛 Known Issues

- Database migrations need to be implemented
- File upload functionality needs completion
- Email notification system needs implementation
- Advanced assessment features need development

## 🔄 Development Principles

This project follows:

- **TDD**: Test-Driven Development approach
- **SOLID**: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Architecture**: Separation of concerns with dependency inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It