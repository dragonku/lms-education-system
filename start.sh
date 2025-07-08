#!/bin/bash

echo "🚀 LMS 시스템 시작"
echo "=================="

# 환경 설정 파일 복사
if [ ! -f .env ]; then
    echo "📝 환경 설정 파일 생성 중..."
    cp .env.example .env
    echo "✅ .env 파일이 생성되었습니다. 필요시 데이터베이스 설정을 수정하세요."
fi

# 백엔드 의존성 설치
echo "📦 백엔드 의존성 설치 중..."
npm install

# 프론트엔드 의존성 설치
echo "📦 프론트엔드 의존성 설치 중..."
cd frontend
npm install
cd ..

# 데이터베이스 확인
echo "🗃️  데이터베이스 연결 확인..."
echo "PostgreSQL이 실행 중인지 확인해주세요."
echo "기본 설정: localhost:5432/lms"

# 백엔드 서버 시작 (백그라운드)
echo "🖥️  백엔드 서버 시작 중..."
npm run dev &
BACKEND_PID=$!

# 잠시 대기
sleep 3

# 프론트엔드 서버 시작 (백그라운드)
echo "🌐 프론트엔드 서버 시작 중..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ LMS 시스템이 시작되었습니다!"
echo ""
echo "📍 접속 주소:"
echo "   - 웹사이트: http://localhost:3001"
echo "   - API 서버: http://localhost:3000"
echo ""
echo "⚡ 서버 상태 확인:"
echo "   - 백엔드 PID: $BACKEND_PID"
echo "   - 프론트엔드 PID: $FRONTEND_PID"
echo ""
echo "🛑 서버 중지: Ctrl+C 또는 ./stop.sh"
echo ""

# 사용자가 Ctrl+C를 누를 때까지 대기
trap "echo '🛑 서버를 중지합니다...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

wait