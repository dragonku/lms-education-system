# 🚀 LMS 배포 가이드

## Vercel 배포 설정

### 프론트엔드 배포

1. **Vercel 프로젝트 생성**
   - https://vercel.com 에서 GitHub 계정으로 로그인
   - "New Project" 클릭
   - `lms-education-system` 저장소 선택

2. **빌드 설정**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **환경 변수 설정**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   GENERATE_SOURCEMAP=false
   ```

### 백엔드 배포 (옵션)

1. **별도 Vercel 프로젝트 생성**
   - 동일한 저장소를 다시 import
   - Root Directory: `.` (루트)
   - Build Command: `npm run build`

2. **환경 변수 설정**
   ```
   NODE_ENV=production
   JWT_SECRET=your-production-jwt-secret
   DB_HOST=your-production-db-host
   DB_PORT=5432
   DB_NAME=your-production-db-name
   DB_USER=your-production-db-user
   DB_PASSWORD=your-production-db-password
   ```

## 대안 배포 방법

### 1. Netlify (프론트엔드만)
```bash
# 빌드 설정
Build command: cd frontend && npm install && npm run build
Publish directory: frontend/build
```

### 2. Railway (백엔드)
- PostgreSQL 데이터베이스 자동 프로비저닝
- 환경 변수 자동 설정

### 3. Heroku (풀스택)
```bash
# 프로젝트 루트에 Procfile 생성
echo "web: npm start" > Procfile
echo "release: npm run migrate" >> Procfile
```

## 데이터베이스 설정

### 1. Vercel Postgres
```bash
# Vercel CLI 설치
npm i -g vercel

# 데이터베이스 생성
vercel env add DATABASE_URL
```

### 2. Supabase
```bash
# 무료 PostgreSQL 제공
# https://supabase.com 에서 프로젝트 생성
```

### 3. Railway PostgreSQL
```bash
# 자동 프로비저닝
# DATABASE_URL 자동 설정
```

## 배포 체크리스트

### 프론트엔드
- [ ] React 앱 빌드 성공
- [ ] 환경 변수 설정
- [ ] API URL 변경
- [ ] 소스맵 비활성화

### 백엔드
- [ ] TypeScript 컴파일 성공
- [ ] 데이터베이스 연결 확인
- [ ] 환경 변수 보안 설정
- [ ] CORS 설정 확인

### 보안
- [ ] JWT 시크릿 변경
- [ ] 데이터베이스 비밀번호 변경
- [ ] HTTPS 적용
- [ ] 민감한 정보 환경 변수화

## 모니터링

### 1. Vercel Analytics
- 자동 성능 모니터링
- 사용자 분석

### 2. Sentry (오류 추적)
```bash
npm install @sentry/react @sentry/node
```

### 3. LogRocket (사용자 세션)
```bash
npm install logrocket
```

## 성능 최적화

### 프론트엔드
- [ ] 코드 스플리팅 적용
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화
- [ ] CDN 적용

### 백엔드
- [ ] 데이터베이스 인덱스 최적화
- [ ] 캐싱 전략 적용
- [ ] API 응답 압축
- [ ] 연결 풀링 설정

---

💡 **배포 완료 후 API 엔드포인트를 프론트엔드 환경 변수에 업데이트하는 것을 잊지 마세요!**