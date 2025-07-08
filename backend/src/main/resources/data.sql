-- Initial demo data for LMS system

-- Insert demo admin user (password: admin123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('admin@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'LMS 관리자', '010-1234-5678', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- Insert demo instructor (password: instructor123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('instructor@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '김강사', '010-2345-6789', 'INSTRUCTOR', 'ACTIVE', NOW(), NOW());

-- Insert demo student (password: student123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('student@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '이학생', '010-3456-7890', 'STUDENT', 'ACTIVE', NOW(), NOW());

-- Insert demo courses
INSERT INTO courses (title, description, target_audience, duration, max_students, min_students, course_type, status, category, created_by, created_at, updated_at)
VALUES 
('React 웹 개발 기초', 'React를 사용한 현대적인 웹 애플리케이션 개발을 배우는 과정입니다. JSX, 컴포넌트, 상태 관리 등의 핵심 개념을 다룹니다.', '웹 개발 입문자, JavaScript 기초 지식 보유자', 40, 20, 5, 'EMPLOYEE_TRAINING', 'PUBLISHED', '웹 개발', 2, NOW(), NOW()),
('Node.js 백엔드 개발', 'Node.js와 Express를 활용한 서버 사이드 개발을 학습합니다. RESTful API 설계 및 데이터베이스 연동을 다룹니다.', '백엔드 개발 희망자', 60, 15, 8, 'JOB_SEEKER_TRAINING', 'PUBLISHED', '백엔드 개발', 2, NOW(), NOW()),
('데이터베이스 설계와 SQL', '관계형 데이터베이스 설계 원칙과 SQL 쿼리 작성법을 배웁니다. PostgreSQL을 사용한 실습을 포함합니다.', '데이터베이스 개발자 희망자', 32, 25, 10, 'GENERAL', 'PUBLISHED', '데이터베이스', 2, NOW(), NOW());

-- Insert course objectives
INSERT INTO course_objectives (course_id, objective) VALUES
(1, 'React 기본 개념 이해'),
(1, 'JSX 문법 숙달'),
(1, '컴포넌트 기반 개발'),
(1, '상태 관리'),
(2, 'Node.js 기본 개념'),
(2, 'Express 프레임워크'),
(2, 'RESTful API 개발'),
(2, '데이터베이스 연동'),
(3, '데이터베이스 설계 원칙'),
(3, 'SQL 쿼리 작성'),
(3, '정규화'),
(3, '성능 최적화');

-- Insert course prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite) VALUES
(1, 'JavaScript ES6+ 기초'),
(1, 'HTML/CSS 기본 지식'),
(2, 'JavaScript 기초'),
(2, '웹 개발 기본 지식'),
(3, '기본적인 컴퓨터 활용 능력');

-- Insert course tags
INSERT INTO course_tags (course_id, tag) VALUES
(1, 'React'),
(1, 'JavaScript'),
(1, '프론트엔드'),
(2, 'Node.js'),
(2, 'Express'),
(2, '백엔드'),
(2, 'API'),
(3, 'SQL'),
(3, 'PostgreSQL'),
(3, '데이터베이스');