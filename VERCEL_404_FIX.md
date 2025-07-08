# 🔧 Vercel 404 에러 해결 가이드

## 🐛 문제 상황
- React Router를 사용하는 SPA에서 새로고침 시 404 에러 발생
- 직접 URL 접근 시 404 에러 발생
- 정적 자산 로딩 실패

## ✅ 해결 방법

### 1. Vercel.json 라우팅 설정 수정

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/favicon.ico", 
      "dest": "/favicon.ico"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/(.*\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot))",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "CI": "false"
  }
}
```

### 2. _redirects 파일 추가

```
# frontend/public/_redirects
/*    /index.html   200
```

### 3. 빌드 설정 최적화

```json
{
  "scripts": {
    "build": "CI=false react-scripts build",
    "vercel-build": "CI=false react-scripts build && echo 'Build completed successfully'"
  }
}
```

## 🔍 주요 변경사항

### 정적 자산 라우팅
- `/static/*` 경로를 정확히 매핑
- `manifest.json`, `favicon.ico`, `robots.txt` 개별 라우팅
- 모든 정적 파일 확장자에 대한 캐싱 헤더 설정

### SPA 라우팅 지원
- 모든 경로 `/*`를 `index.html`로 리다이렉트
- React Router가 클라이언트 사이드에서 라우팅 처리

### 빌드 최적화
- `CI=false`로 경고를 오류로 처리하지 않음
- 빌드 완료 확인 메시지 추가

## 🚀 Vercel 재배포 방법

### 방법 1: 자동 재배포 (추천)
1. GitHub에 변경사항 푸시
2. Vercel이 자동으로 감지하여 재배포

### 방법 2: 수동 재배포
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. "Redeploy" 버튼 클릭

### 방법 3: CLI 재배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 폴더에서
cd frontend
vercel --prod
```

## 🧪 테스트 방법

### 로컬 테스트
```bash
# 빌드 테스트
cd frontend
npm run build

# 빌드 결과 서빙
npx serve -s build

# 테스트 URL들
http://localhost:3000
http://localhost:3000/courses
http://localhost:3000/login
http://localhost:3000/courses/123
```

### 프로덕션 테스트
1. **홈페이지**: https://your-app.vercel.app
2. **강좌 목록**: https://your-app.vercel.app/courses
3. **로그인**: https://your-app.vercel.app/login
4. **새로고침 테스트**: 각 페이지에서 F5 새로고침
5. **직접 URL 접근**: 브라우저 주소창에 직접 입력

## 🔧 추가 트러블슈팅

### 여전히 404가 발생하는 경우

1. **빌드 디렉토리 확인**
   ```bash
   ls -la frontend/build/
   # index.html이 있는지 확인
   ```

2. **Vercel 설정 확인**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **환경 변수 확인**
   ```
   CI=false
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```

4. **캐시 클리어**
   - 브라우저 캐시 클리어
   - Vercel 캐시 클리어 (대시보드에서)

### 정적 자산이 로드되지 않는 경우

1. **빌드 결과 확인**
   ```bash
   cd frontend/build/static
   ls -la
   # js, css 폴더가 있는지 확인
   ```

2. **네트워크 탭 확인**
   - 개발자 도구 > Network 탭
   - 어떤 파일이 404인지 확인
   - URL 패턴 확인

## 💡 모범 사례

### SPA 라우팅
- 항상 `/*`를 `index.html`로 리다이렉트
- API 경로와 정적 자산 경로는 별도 처리

### 캐싱 전략
- 정적 자산: 1년 캐싱 (`max-age=31536000`)
- HTML: 캐싱 안함 (자동 처리)

### 빌드 최적화
- `CI=false`로 경고 허용
- 소스맵 비활성화로 용량 절약

---

이제 404 에러 없이 모든 라우트가 정상 작동해야 합니다! 🎉