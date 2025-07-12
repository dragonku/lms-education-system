# 🚀 Vercel 자동 배포 설정 가이드

GitHub Actions를 통한 Vercel 자동 배포를 설정하기 위한 단계별 가이드입니다.

## 1단계: Vercel 계정 및 프로젝트 설정

### 1.1 Vercel 로그인
```bash
vercel login
```
브라우저에서 GitHub 계정으로 Vercel에 로그인합니다.

### 1.2 프로젝트 초기화
```bash
vercel
```
- 프로젝트를 배포할 때 묻는 질문에 답변:
  - Link to existing project? **N**
  - Project name: **lms-education-system**
  - Directory: **./** (현재 디렉토리)
  - Deploy? **N** (나중에 GitHub Actions로 배포)

## 2단계: Vercel 토큰 및 프로젝트 정보 획득

### 2.1 Vercel 토큰 생성
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Settings** → **Tokens** 이동
3. **Create** 클릭하여 새 토큰 생성
4. 토큰 이름: `GitHub Actions`
5. 생성된 토큰을 복사 (한 번만 표시됨)

### 2.2 프로젝트 ID 및 조직 ID 확인
```bash
vercel project ls
```
또는 프로젝트 루트에서:
```bash
cat .vercel/project.json
```

## 3단계: GitHub Secrets 설정

GitHub 저장소의 **Settings** → **Secrets and variables** → **Actions**에서 다음 secrets을 추가:

### 필수 Secrets:
```
VERCEL_TOKEN=vercel_token_value_here
VERCEL_ORG_ID=team_id_or_username_here  
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxx
```

### 예시:
```bash
# GitHub CLI 사용 (권장)
gh secret set VERCEL_TOKEN --body "vercel_token_value_here"
gh secret set VERCEL_ORG_ID --body "team_id_or_username_here"
gh secret set VERCEL_PROJECT_ID --body "prj_xxxxxxxxxxxxxxxxxxxx"
```

## 3단계: 백엔드 배포 (옵션)

### 새 프로젝트 생성
1. "New Project" 클릭
2. 동일한 `lms-education-system` 저장소 선택
3. 프로젝트명: `lms-backend-api`

### 백엔드 빌드 설정
```
Framework Preset: Other
Root Directory: .
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

### 백엔드 환경 변수
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3000

# Database (Vercel Postgres 또는 외부 DB)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

## 4단계: 데이터베이스 설정

### 옵션 1: Vercel Postgres
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 링크
vercel link

# Postgres addon 추가
vercel env add DATABASE_URL
```

### 옵션 2: Supabase (추천)
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings > Database에서 연결 정보 확인
4. Vercel 환경 변수에 추가

### 옵션 3: Railway
1. https://railway.app 가입  
2. PostgreSQL 템플릿 배포
3. 연결 정보를 Vercel에 추가

## 5단계: 도메인 설정 (옵션)

### 커스텀 도메인 추가
1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력 (예: lms.yourdomain.com)
3. DNS 설정 완료

### 서브도메인 설정
- Frontend: `app.yourdomain.com`
- Backend: `api.yourdomain.com`

## 6단계: 배포 확인

### 프론트엔드 확인
- ✅ 빌드 성공
- ✅ 페이지 로딩 확인
- ✅ API 연결 테스트
- ✅ 반응형 디자인 확인

### 백엔드 확인  
- ✅ API 엔드포인트 응답
- ✅ 데이터베이스 연결
- ✅ 인증 시스템 동작
- ✅ CORS 설정 확인

## 7단계: 성능 최적화

### Vercel Analytics 활성화
```javascript
// frontend/src/index.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 캐싱 설정
```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 트러블슈팅

### 빌드 오류
```bash
# 로컬에서 빌드 테스트
cd frontend
npm run build

# 타입 오류 확인
npm run type-check
```

### API 연결 오류
1. 환경 변수 URL 확인
2. CORS 설정 점검
3. 네트워크 탭에서 요청 확인

### 데이터베이스 연결 오류
1. 연결 문자열 확인
2. 방화벽 설정 점검
3. SSL 설정 확인

## 배포 완료 체크리스트

- [ ] 프론트엔드 Vercel 배포 완료
- [ ] 백엔드 Vercel 배포 완료 (옵션)
- [ ] 데이터베이스 연결 확인
- [ ] 환경 변수 설정 완료
- [ ] API 엔드포인트 테스트
- [ ] 사용자 인증 기능 테스트
- [ ] 강좌 목록/상세 페이지 확인
- [ ] 모바일 반응형 확인
- [ ] 도메인 설정 완료 (옵션)

## 배포 URL 예시

**프론트엔드:** https://lms-education-system.vercel.app
**백엔드:** https://lms-backend-api.vercel.app
**데이터베이스:** Vercel Postgres 또는 Supabase

---

🎉 **배포 완료 후 README의 데모 URL을 업데이트하세요!**