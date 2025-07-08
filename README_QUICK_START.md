# 🚀 LMS 시스템 빠른 시작 가이드

## ✅ 사전 요구사항

1. **Node.js 18+** 설치 확인
   ```bash
   node --version
   npm --version
   ```

2. **PostgreSQL 14+** 설치 및 실행
   ```bash
   # Ubuntu/WSL
   sudo service postgresql start
   
   # macOS
   brew services start postgresql
   ```

3. **데이터베이스 생성**
   ```bash
   # PostgreSQL 접속
   sudo -u postgres psql
   
   # 데이터베이스 생성
   CREATE DATABASE lms;
   CREATE USER lms_user WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE lms TO lms_user;
   \q
   ```

## 🎯 한 번에 실행하기

### 방법 1: 자동 스크립트 사용
```bash
cd /home/dragonku/lms
./start.sh
```

### 방법 2: 수동 실행

1. **환경 설정**
   ```bash
   cp .env.example .env
   # .env 파일에서 데이터베이스 설정 확인/수정
   ```

2. **백엔드 서버 실행**
   ```bash
   npm install
   npm run dev
   ```
   
3. **프론트엔드 서버 실행** (새 터미널)
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🌐 접속 주소

- **웹사이트**: http://localhost:3001
- **API 서버**: http://localhost:3000
- **API 상태 확인**: http://localhost:3000/api/health

## 👤 테스트 계정

### 관리자 계정 생성 (API 호출)
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lms.com",
    "password": "admin123",
    "name": "관리자",
    "phoneNumber": "010-1234-5678",
    "userType": "admin"
  }'
```

### 학생 계정 생성 (웹에서)
1. http://localhost:3001/register 접속
2. 회원가입 양식 작성
3. 관리자 승인 대기

## 🔧 주요 기능

### 웹 기능
- ✅ 회원가입/로그인
- ✅ 강좌 목록 조회
- ✅ 강좌 상세 정보
- ✅ 관리자 강좌 관리
- ✅ 반응형 디자인

### API 기능
- ✅ 사용자 인증 (JWT)
- ✅ 강좌 CRUD
- ✅ 수강 신청 시스템
- ✅ 권한 기반 접근 제어

## 🛑 시스템 중지

```bash
# 스크립트 사용
./stop.sh

# 수동 중지
# Ctrl+C로 각 서버 중지
```

## 🔍 문제 해결

### 1. 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -ti:3000  # 백엔드
lsof -ti:3001  # 프론트엔드

# 프로세스 종료
kill -9 [PID]
```

### 2. 데이터베이스 연결 오류
- PostgreSQL 서비스 실행 확인
- .env 파일의 DB 설정 확인
- 데이터베이스 생성 확인

### 3. 의존성 오류
```bash
# 캐시 정리 후 재설치
rm -rf node_modules package-lock.json
npm install

# 프론트엔드도 동일하게
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📱 화면 구성

1. **홈페이지** - 시스템 소개 및 통계
2. **로그인/회원가입** - 사용자 인증
3. **강좌 목록** - 필터링 및 검색 기능
4. **강좌 상세** - 상세 정보 및 수강 신청
5. **마이페이지** - 개인 정보 관리 (예정)
6. **관리자 페이지** - 시스템 관리 (예정)

## 🎨 기술 스택

**Frontend:**
- React 18 + TypeScript
- Styled Components
- React Router
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication

**Architecture:**
- Clean Architecture
- TDD (Test-Driven Development)
- Repository Pattern
- SOLID Principles

---

💡 **문제가 있으시면 프로젝트 루트의 README.md를 참고하거나 이슈를 등록해주세요.**