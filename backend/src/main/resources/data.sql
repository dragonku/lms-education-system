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