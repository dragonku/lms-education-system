# Backend Setup Instructions

⚠️ **현재 Java 21 환경에서 Maven 컴파일 이슈 발생 중**

현재 시스템 환경에서 Maven compiler plugin이 Java 21을 지원하지 않아 컴파일 오류가 발생합니다.

## 해결 방법

### 옵션 1: Java 17 사용 (권장)
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install openjdk-17-jdk

# Java 17로 전환
sudo update-alternatives --config java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### 옵션 2: IDE에서 실행
IntelliJ IDEA나 Eclipse 같은 IDE에서 Spring Boot 애플리케이션을 직접 실행하세요.

### 옵션 3: 사전 빌드된 JAR 사용
```bash
# 프로젝트에 포함된 빌드된 JAR가 있다면
java -jar backend/target/demo-0.0.1-SNAPSHOT.jar
```

## Prerequisites

Java와 Maven이 설치되어 있어야 합니다.

### Java 17 설치 (권장)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# macOS (Homebrew)
brew install openjdk@17

# Windows
# Oracle JDK 17 또는 OpenJDK 17 다운로드 및 설치
```

### Maven 설치
```bash
# Ubuntu/Debian
sudo apt install maven

# macOS (Homebrew)
brew install maven

# Windows
# Maven 공식 사이트에서 다운로드 및 설치
```

## 백엔드 서버 실행

1. 백엔드 디렉토리로 이동:
```bash
cd backend
```

2. Spring Boot 애플리케이션 실행:
```bash
mvn spring-boot:run
```

3. 서버가 시작되면 http://localhost:8080 에서 접근 가능

## 프론트엔드 연동

1. 프로젝트 루트에 `.env` 파일이 생성되어 있는지 확인:
```
REACT_APP_API_URL=http://localhost:8080/api
```

2. 프론트엔드 실행:
```bash
npm start
```

## API 테스트

### Health Check
```bash
curl http://localhost:8080/api/health
```

### 로그인 테스트 (데모 계정)
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@lms.com", "password": "admin123"}'
```

### 강좌 목록 조회
```bash
curl http://localhost:8080/api/courses
```

## 데이터베이스 확인

H2 콘솔: http://localhost:8080/api/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## 문제 해결

### 포트 충돌
만약 8080 포트가 사용 중이라면:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

그리고 `.env` 파일을 수정:
```
REACT_APP_API_URL=http://localhost:8081/api
```