#!/bin/bash

echo "🛑 LMS 시스템 중지 중..."

# Node.js 프로세스 찾기 및 종료
echo "📦 백엔드 서버 중지..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node.*src/index.ts" 2>/dev/null || true

echo "🌐 프론트엔드 서버 중지..."
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

# 포트 사용 중인 프로세스 확인 및 종료
echo "🔍 포트 정리 중..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "✅ LMS 시스템이 완전히 중지되었습니다."