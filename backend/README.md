# LMS Backend - Spring Boot

Learning Management System의 Spring Boot 기반 백엔드 API 서버입니다.

## 기술 스택

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security** (JWT 인증)
- **Spring Data JPA**
- **H2 Database** (개발용)
- **PostgreSQL** (프로덕션용)
- **Maven**

## 주요 기능

### 인증 및 사용자 관리
- JWT 기반 인증
- 사용자 등록 및 로그인
- 역할 기반 접근 제어 (ADMIN, INSTRUCTOR, STUDENT, COMPANY_MANAGER)
- 사용자 상태 관리 (PENDING_APPROVAL, ACTIVE, INACTIVE, SUSPENDED)

### 강좌 관리
- 강좌 CRUD 작업
- 강좌 카테고리 및 태그 관리
- 강좌 유형별 분류 (재직자 교육, 구직자 양성과정, 일반 교육)
- 페이지네이션 및 검색 기능

## API 엔드포인트

### 인증 관련
- `POST /api/users/login` - 로그인
- `POST /api/users/register` - 회원가입
- `GET /api/users/profile` - 사용자 프로필 조회

### 강좌 관련
- `GET /api/courses` - 강좌 목록 조회 (페이지네이션, 필터링 지원)
- `GET /api/courses/{id}` - 특정 강좌 조회
- `POST /api/courses` - 강좌 생성 (인증 필요)
- `PUT /api/courses/{id}` - 강좌 수정 (인증 필요)
- `DELETE /api/courses/{id}` - 강좌 삭제 (인증 필요)
- `GET /api/courses/categories` - 강좌 카테고리 목록

### 기타
- `GET /api/health` - 서버 상태 확인

## 실행 방법

### 1. 개발 환경 실행
```bash
cd backend
mvn spring-boot:run
```

### 2. 프로덕션 환경 실행
```bash
# PostgreSQL 설정 후
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## 데이터베이스 설정

### 개발 환경 (H2)
- URL: `jdbc:h2:mem:testdb`
- Console: http://localhost:8080/api/h2-console
- Username: `sa`
- Password: `password`

### 프로덕션 환경 (PostgreSQL)
환경 변수 설정:
```bash
export DB_USERNAME=your_db_username
export DB_PASSWORD=your_db_password
```

## 기본 데모 데이터

시스템 시작 시 다음 데모 계정이 생성됩니다:

- **관리자**: admin@lms.com / admin123
- **강사**: instructor@lms.com / instructor123  
- **학생**: student@lms.com / student123

3개의 샘플 강좌도 함께 생성됩니다.

## CORS 설정

모든 오리진에서의 요청을 허용하도록 설정되어 있습니다. 프로덕션 환경에서는 보안을 위해 특정 도메인만 허용하도록 수정하세요.

## JWT 설정

- Secret Key: `mySecretKey123456789012345678901234567890`
- 만료 시간: 24시간 (86400000ms)

프로덕션 환경에서는 환경 변수로 설정하는 것을 권장합니다.

## 프론트엔드 연동

React 프론트엔드와 연동하려면:

1. 프론트엔드의 환경 변수 설정:
```bash
REACT_APP_API_URL=http://localhost:8080/api
```

2. 백엔드 서버 실행 후 프론트엔드 실행

## 개발 참고 사항

- JPA Auditing 활성화로 자동 타임스탬프 관리
- BCrypt를 사용한 비밀번호 암호화
- 엔터티 간 관계 매핑 구현
- RESTful API 설계 원칙 준수
- 예외 처리 및 응답 표준화