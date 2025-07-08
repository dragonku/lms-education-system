# 🚨 Vercel 404 에러 긴급 수정 가이드

## 🔥 즉시 적용해야 할 설정

### 1. Vercel 대시보드에서 수동 설정

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **프로젝트 선택**: `lms-education-system` 클릭
3. **Settings 탭** 클릭
4. **Functions** 섹션에서 다음 설정:

#### Build & Development Settings
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
Development Command: npm start
```

#### Environment Variables
```
Name: CI
Value: false

Name: GENERATE_SOURCEMAP  
Value: false

Name: REACT_APP_API_URL
Value: https://api.example.com/api
```

### 2. Vercel에서 직접 Rewrites 설정

**Settings > Functions > Configure** 에서:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

또는 **Settings > Git**에서 Override 설정:

```
Build Command: cd frontend && npm run build
Output Directory: frontend/build
```

## 🔧 대안 1: 완전 새로운 배포

### 새 Vercel 프로젝트 생성
1. **기존 프로젝트 삭제** (옵션)
2. **New Project** 클릭
3. **Import Git Repository**
4. **Settings 변경**:

```
Project Name: lms-frontend
Framework: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
Node.js Version: 18.x
```

### 환경 변수 추가
```
CI=false
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://api.example.com/api
```

## 🔧 대안 2: Vercel CLI 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 프론트엔드 폴더로 이동
cd frontend

# 빌드
npm run build

# Vercel에 배포
vercel --prod

# 설정 질문에 답변:
# ? Set up and deploy? Y
# ? Which scope? [본인 계정 선택]
# ? Link to existing project? N  
# ? What's your project's name? lms-frontend
# ? In which directory is your code located? ./
```

## 🔧 대안 3: 수동 빌드 업로드

1. **로컬에서 빌드**:
   ```bash
   cd frontend
   npm run build
   ```

2. **빌드 폴더 압축**:
   ```bash
   cd build
   zip -r ../build.zip *
   ```

3. **Vercel에서 Static 배포**:
   - New Project > Import Third-Party Git Repository
   - Upload build.zip 파일

## 🚨 즉시 확인사항

### 현재 배포된 사이트 확인
1. **배포 URL 접속**: https://your-app.vercel.app
2. **개발자 도구** 열기 (F12)
3. **Console 탭**에서 에러 확인
4. **Network 탭**에서 실패한 요청 확인

### 일반적인 문제들

#### 1. index.html을 찾을 수 없음
**해결**: Root Directory가 `frontend`로 설정되어 있는지 확인

#### 2. Build 실패
**해결**: Build Command가 `npm run build`인지 확인

#### 3. 정적 파일 404
**해결**: Output Directory가 `build`인지 확인

#### 4. API 호출 실패
**해결**: REACT_APP_API_URL 환경변수 확인

## 📱 모바일 테스트

### 테스트 URL들
- https://your-app.vercel.app
- https://your-app.vercel.app/courses
- https://your-app.vercel.app/login
- https://your-app.vercel.app/register

### 각 URL에서 테스트
1. **새로고침** (F5 또는 당겨서 새로고침)
2. **뒤로가기/앞으로가기** 
3. **북마크 후 재접속**
4. **직접 URL 입력**

## 🔍 디버깅 방법

### 1. Vercel 로그 확인
1. Vercel 대시보드 > Functions 탭
2. View Function Logs
3. 에러 메시지 확인

### 2. Build 로그 확인  
1. Deployments 탭
2. 최근 배포 클릭
3. Build Logs 확인

### 3. 404 에러 패턴 확인
```
✅ 정상: https://app.vercel.app (홈페이지)
❌ 404: https://app.vercel.app/courses (페이지 새로고침)
❌ 404: https://app.vercel.app/login (직접 접근)
```

## 💡 마지막 해결책

### 강제 리빌드
```bash
# 최신 코드 다시 푸시
git add .
git commit -m "force rebuild"
git push origin main

# 또는 빈 커밋으로 강제 배포
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

### 캐시 클리어
1. **브라우저 캐시** 완전 삭제
2. **Vercel 에지 캐시** 클리어 (대시보드에서)
3. **DNS 캐시** 클리어 (`ipconfig /flushdns`)

---

## 🎯 체크리스트

이 가이드를 따라했다면 체크하세요:

- [ ] Vercel 프로젝트 설정 확인/수정
- [ ] 환경 변수 추가 
- [ ] Root Directory: `frontend` 설정
- [ ] Build Command: `npm run build` 설정
- [ ] Output Directory: `build` 설정
- [ ] 새로운 배포 트리거
- [ ] 모든 URL에서 테스트
- [ ] 새로고침 테스트
- [ ] 모바일에서 테스트

**이제 404 에러가 해결되어야 합니다!** 🎉

만약 여전히 문제가 있다면:
1. 스크린샷 찍어서 확인
2. 브라우저 개발자 도구 Console/Network 탭 확인
3. Vercel 배포 로그 확인