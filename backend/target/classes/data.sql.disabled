-- Release 1 초기 데이터 설정

-- 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('admin@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
        'LMS 관리자', '010-1234-5678', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- 관리자 권한 설정
INSERT INTO user_authorities (user_id, authority) VALUES (1, 'ADMIN');
INSERT INTO user_authorities (user_id, authority) VALUES (1, 'USER');

-- 테스트용 재직자 계정 (비밀번호: test123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('employee@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
        '김재직', '010-2345-6789', 'EMPLOYEE', 'ACTIVE', NOW(), NOW());

INSERT INTO user_authorities (user_id, authority) VALUES (2, 'USER');

-- 테스트용 구직자 계정 (비밀번호: test123)
INSERT INTO users (email, password, name, phone_number, user_type, status, created_at, updated_at) 
VALUES ('jobseeker@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
        '이구직', '010-3456-7890', 'JOB_SEEKER', 'ACTIVE', NOW(), NOW());

INSERT INTO user_authorities (user_id, authority) VALUES (3, 'USER');

-- 테스트용 협약사 계정 (비밀번호: test123)
INSERT INTO users (email, password, name, phone_number, user_type, status, company_name, created_at, updated_at) 
VALUES ('company@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
        '박협약', '010-4567-8901', 'COMPANY', 'ACTIVE', '테스트협약사', NOW(), NOW());

INSERT INTO user_authorities (user_id, authority) VALUES (4, 'COMPANY');
INSERT INTO user_authorities (user_id, authority) VALUES (4, 'USER');

-- Release 2: 과정 데이터 추가
INSERT INTO courses (title, description, instructor, category, capacity, current_enrollment, start_date, end_date, duration, price, status, image_url, created_at, updated_at) VALUES
('React 기초부터 실전까지', 'React의 기본 개념부터 실무에서 사용하는 고급 기능까지 단계별로 학습합니다. Hook, Context API, 상태 관리 등 모던 React 개발에 필요한 모든 것을 다룹니다.', '김개발', '프론트엔드', 30, 12, '2025-08-01', '2025-09-30', '8주', 350000, 'ACTIVE', 'https://via.placeholder.com/300x200?text=React+Course', NOW(), NOW()),
('Spring Boot 마스터 클래스', 'Spring Boot를 활용한 REST API 개발, JPA를 이용한 데이터베이스 연동, 보안 구현 등 백엔드 개발의 핵심 기술들을 익힙니다.', '박백엔드', '백엔드', 25, 8, '2025-08-15', '2025-10-15', '10주', 420000, 'ACTIVE', 'https://via.placeholder.com/300x200?text=Spring+Boot', NOW(), NOW()),
('Python 데이터 분석 완전 정복', 'Python을 이용한 데이터 분석의 모든 과정을 학습합니다. Pandas, NumPy, Matplotlib을 활용한 데이터 처리와 시각화를 다룹니다.', '이데이터', '데이터분석', 20, 20, '2025-07-20', '2025-09-20', '12주', 480000, 'FULL', 'https://via.placeholder.com/300x200?text=Python+Data', NOW(), NOW()),
('UI/UX 디자인 실무', 'Figma를 활용한 실무 UI/UX 디자인 과정입니다. 사용자 경험 설계부터 프로토타이핑까지 전 과정을 다룹니다.', '최디자인', '디자인', 15, 5, '2025-09-01', '2025-11-01', '8주', 320000, 'ACTIVE', 'https://via.placeholder.com/300x200?text=UI+UX+Design', NOW(), NOW()),
('DevOps 엔지니어 양성 과정', 'Docker, Kubernetes, Jenkins를 활용한 CI/CD 파이프라인 구축과 클라우드 인프라 관리를 학습합니다.', '한데브옵스', '인프라', 12, 3, '2025-08-10', '2025-11-10', '14주', 550000, 'ACTIVE', 'https://via.placeholder.com/300x200?text=DevOps', NOW(), NOW());