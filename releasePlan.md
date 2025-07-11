# LMS 개발 릴리즈 계획

## 개요

본 문서는 `prd.md`와 `architecture_guide.md`를 기반으로 한 LMS 개발 릴리즈 계획을 정의합니다. 각 릴리즈는 동작 가능한 소프트웨어(Working Software)를 목표로 하며, 백엔드(Spring Boot)와 프론트엔드(React)의 통합을 포함합니다.

## 기술 스택 및 아키텍처

*   **Backend:** Spring Boot, Java, JPA, PostgreSQL
*   **Frontend:** React, TypeScript, Axios
*   **Architecture:** Clean Architecture, TDD, MSA (고려)
*   **CI/CD:** GitHub Actions

## Git Worktree 병렬 개발 환경 구성

### 디렉토리 구조 권장사항

```
lms/                          # 메인 프로젝트 디렉토리
├── main/                     # 메인 브랜치 작업공간 (기본)
│   ├── backend/
│   ├── frontend/
│   └── docs/
├── worktrees/                # Git worktree 전용 디렉토리
│   ├── sprint-1-auth/        # Sprint 1: 인증 시스템
│   ├── sprint-2-backend/     # Sprint 2: 백엔드 개발
│   ├── sprint-2-frontend/    # Sprint 2: 프론트엔드 개발
│   ├── sprint-3-board/       # Sprint 3: 게시판 개발
│   ├── sprint-4-survey/      # Sprint 4: 설문 시스템
│   ├── sprint-5-admin/       # Sprint 5: 관리자 기능
│   └── integration/          # 통합 테스트용 브랜치
└── shared/                   # 공유 리소스 (문서, 설정 등)
```

### Git Worktree 초기 설정 명령어

```bash
# 1. 메인 프로젝트에서 worktrees 디렉토리 생성
cd /home/dragonku/lms
mkdir -p worktrees

# 2. 각 스프린트별 브랜치 생성 및 worktree 설정
git branch sprint-1-auth
git branch sprint-2-backend  
git branch sprint-2-frontend
git branch sprint-3-board
git branch sprint-4-survey
git branch sprint-5-admin
git branch integration

# 3. Worktree 생성
git worktree add worktrees/sprint-1-auth sprint-1-auth
git worktree add worktrees/sprint-2-backend sprint-2-backend
git worktree add worktrees/sprint-2-frontend sprint-2-frontend
git worktree add worktrees/sprint-3-board sprint-3-board
git worktree add worktrees/sprint-4-survey sprint-4-survey
git worktree add worktrees/sprint-5-admin sprint-5-admin
git worktree add worktrees/integration integration

# 4. Worktree 상태 확인
git worktree list
```

### 병렬 개발 워크플로우

1. **스프린트 시작**: 각 worktree에서 독립적으로 개발
2. **정기 동기화**: 매주 금요일 integration 브랜치에 merge
3. **릴리즈 준비**: integration 브랜치에서 테스트 후 main으로 merge
4. **브랜치 정리**: 완료된 스프린트 worktree 정리

### 브랜치 병합 전략

```bash
# 스프린트 완료 후 integration으로 병합
cd worktrees/sprint-1-auth
git checkout integration
git merge sprint-1-auth --no-ff

# 통합 테스트 완료 후 main으로 병합
git checkout main
git merge integration --no-ff

# 완료된 worktree 정리
git worktree remove worktrees/sprint-1-auth
git branch -d sprint-1-auth
```

## 스프린트 기반 릴리즈 계획

### Sprint 1: 기본 설정 및 사용자 인증 (1주차) - ✅ 완료

**Git Worktree 설정:**
```bash
# Sprint 1 개발 시작
cd /home/dragonku/lms
git worktree add worktrees/sprint-1-auth sprint-1-auth
cd worktrees/sprint-1-auth
```

**병렬 개발 구조:**
- **Backend Team**: 인증 시스템 구현 ✅
- **Frontend Team**: 로그인/회원가입 UI 구현 ✅
- **DevOps Team**: CI/CD 파이프라인 구축 ✅

**Sprint Review 완료 항목:**
- [x] JWT 기반 인증 시스템 구현
- [x] 사용자 회원가입 (재직자/구직자/협약사) 기능
- [x] 로그인/로그아웃 기능
- [x] 역할 기반 접근 제어
- [x] 반응형 UI 구현
- [x] CI/CD 파이프라인 구축

### Sprint 2: 핵심 컨텐츠 관리 - 백엔드 (2주차) - ✅ 완료

**Git Worktree 설정:**
```bash
# Sprint 2 백엔드 개발
git worktree add worktrees/sprint-2-backend sprint-2-backend
cd worktrees/sprint-2-backend
```

**Focus**: Course 엔티티 및 API 개발 ✅

**Sprint Review 완료 항목:**
- [x] Course 엔티티 및 Repository 구현
- [x] 과정 CRUD API 개발
- [x] 수강 신청 API 개발
- [x] 관리자 권한 기반 과정 관리 API

### Sprint 3: 핵심 컨텐츠 관리 - 프론트엔드 (3주차) - ✅ 완료

**Git Worktree 설정:**
```bash
# Sprint 3 프론트엔드 개발 (Sprint 2와 병렬 진행 가능)
git worktree add worktrees/sprint-2-frontend sprint-2-frontend
cd worktrees/sprint-2-frontend
```

**Focus**: 과정 관리 UI 및 마이페이지 구현 ✅

**Sprint Review 완료 항목:**
- [x] 과정 목록 및 상세 페이지 구현
- [x] 과정 검색 및 필터링 기능
- [x] 수강 신청 UI 구현
- [x] 마이페이지 수강 현황 조회
- [x] 관리자 과정 관리 UI

### Sprint 4: 게시판 및 커뮤니티 기능 (4주차) - 🔄 개발 필요

**Git Worktree 설정:**
```bash
# Sprint 4 게시판 개발
git worktree add worktrees/sprint-3-board sprint-3-board
cd worktrees/sprint-3-board
```

**Focus**: 게시판 시스템 풀스택 구현

**Sprint Review 예정 항목:**
- [ ] 공지사항 게시판 CRUD 기능
- [ ] Q&A 게시판 CRUD 기능
- [ ] 파일 업로드/다운로드 기능
- [ ] HTML 에디터 연동
- [ ] 비밀글 기능 및 권한 제어

### Sprint 5: 설문 및 평가 시스템 (5주차) - 🔄 개발 필요

**Git Worktree 설정:**
```bash
# Sprint 5 설문 시스템 개발
git worktree add worktrees/sprint-4-survey sprint-4-survey
cd worktrees/sprint-4-survey
```

**Focus**: 설문조사 및 시험 기능 구현

**Sprint Review 예정 항목:**
- [ ] 설문 생성 및 관리 기능
- [ ] 다양한 문항 유형 지원
- [ ] 문제 은행 관리 기능
- [ ] 시험 출제 및 응시 기능
- [ ] 자동 채점 시스템

### Sprint 6: 관리자 및 통계 기능 (6주차) - 🔄 개발 필요

**Git Worktree 설정:**
```bash
# Sprint 6 관리자 기능 개발
git worktree add worktrees/sprint-5-admin sprint-5-admin
cd worktrees/sprint-5-admin
```

**Focus**: 관리자 대시보드 및 통계 시스템 구현

**Sprint Review 예정 항목:**
- [ ] 강사 관리 기능
- [ ] 시설 및 장비 관리
- [ ] 통계 대시보드 및 차트
- [ ] 엑셀 다운로드 기능
- [ ] 보고서 생성 기능

### 통합 스프린트 (7주차) - 🔄 개발 필요

**Git Worktree 설정:**
```bash
# 통합 테스트 및 배포 준비
git worktree add worktrees/integration integration
cd worktrees/integration

# 모든 스프린트 결과 통합
git merge sprint-1-auth --no-ff
git merge sprint-2-backend --no-ff
git merge sprint-2-frontend --no-ff
git merge sprint-3-board --no-ff
git merge sprint-4-survey --no-ff
git merge sprint-5-admin --no-ff
```

**통합 테스트 예정 항목:**
- [ ] 전체 시스템 통합 테스트
- [ ] 성능 테스트 및 최적화
- [ ] 보안 테스트 및 점검
- [ ] 사용자 승인 테스트
- [ ] 운영 환경 배포 준비

## 원본 릴리즈 계획 (참고용)

### Release 1: 기본 설정 및 사용자 인증 (2주)

**목표:** 사용자 회원가입, 로그인, 권한 관리 등 핵심 인증 기능을 구현하고, 프로젝트의 기본 구조를 설정합니다.

| 구분 | 기능 명칭 | 요구사항 ID (SFR) | 개발 내용 | 인수 기준 |
| --- | --- | --- | --- | --- |
| **Backend** | 시스템 표준 준수, 회원가입, 협약사 가입, 보안 | SFR-001, SFR-008, SFR-009, SFR-011 | - Spring Security 및 JWT를 이용한 인증/인가 구현<br>- User, Authority 엔티티 및 Repository 설계<br>- 회원가입(재직자/구직자), 협약사 가입 API 개발<br>- TDD 기반 테스트 코드 작성 | - API 요청 시 JWT 토큰 기반 인증 성공<br>- 역할(재직자, 구직자, 관리자)에 따른 API 접근 제어<br>- 회원가입 및 협약사 가입 기능 정상 동작 |
| **Frontend** | 회원가입, 협약사 가입 | SFR-008, SFR-009 | - React 프로젝트 초기 설정 (CRA, TypeScript)<br>- 로그인, 회원가입, 협약사 가입 페이지 UI 구현<br>- Axios를 이용한 백엔드 API 연동<br>- 상태 관리를 위한 Context API 설정 | - 로그인/로그아웃 기능 정상 동작<br>- 회원가입 유형(재직자/구직자)에 따른 폼 변화<br>- API 연동을 통한 실제 회원가입 성공 |
| **공통** | 프로젝트 설정 | SFR-001 | - GitHub Actions를 이용한 CI/CD 파이프라인 구축<br>- Backend/Frontend Dockerfile 작성 | - Pull Request 시 자동 빌드 및 테스트 실행<br>- Docker 이미지를 통한 배포 가능 |

**릴리즈 확인 체크리스트:**
- [x] (SFR-008) 관리자, 재직자, 구직자 계정으로 각각 회원가입이 가능한가?
- [x] (SFR-008) 로그인/로그아웃 기능이 정상적으로 동작하는가?
- [x] (SFR-011) 로그인 시 발급된 JWT 토큰으로 인증이 필요한 API에 접근할 수 있는가?
- [x] (SFR-005) 권한이 없는 API에 접근 시 403 (Forbidden) 에러가 발생하는가?
- [x] (SFR-009) 협약사 가입 신청이 가능한가?
- [x] (SFR-001) GitHub PR 생성 시 CI 빌드 및 테스트가 자동으로 실행되는가?

**Working Software 검증 완료:**
- [x] 사용자 인증 시스템 완전 동작
- [x] 역할 기반 접근 제어 동작
- [x] 반응형 웹 UI 동작
- [x] CI/CD 파이프라인 동작

---

### Release 2: 핵심 컨텐츠 관리 (과정) (3주)

**목표:** 시스템의 핵심 기능인 교육 과정을 등록, 조회, 신청하는 기능을 구현합니다.

| 구분 | 기능 명칭 | 요구사항 ID (SFR) | 개발 내용 | 인수 기준 |
| --- | --- | --- | --- | --- |
| **Backend** | 과정 소개 및 신청, 과정 관리 | SFR-007, SFR-018 | - Course, Category 엔티티 및 Repository 설계<br>- 과정 등록/수정/삭제/조회 API 개발<br>- 수강 신청 및 취소 API 개발<br>- 관리자/사용자 권한에 따른 과정 접근 제어 | - CRUD API를 통한 과정 정보 관리<br>- 사용자가 과정을 신청하고, 마이페이지에서 확인 가능<br>- 신청 시 정원 초과 등 예외 처리 |
| **Frontend** | 과정 소개 및 신청, 마이페이지 | SFR-007, SFR-010 | - 과정 목록, 상세 정보 페이지 UI 구현<br>- 사용자가 수강 신청/취소할 수 있는 기능 구현<br>- 마이페이지에서 나의 수강 현황 조회 기능 구현 | - 과정 목록 및 상세 정보가 화면에 정상적으로 표시됨<br>- 수강 신청 후 마이페이지에 즉시 반영<br>- 반응형 디자인으로 모바일에서도 확인 가능 |

**릴리즈 확인 체크리스트:**
- [x] (SFR-018) 관리자가 새로운 교육 과정을 등록, 수정, 삭제할 수 있는가?
- [x] (SFR-007) 전체 교육 과정 목록을 조회할 수 있는가?
- [x] (SFR-007) 특정 과정의 상세 정보를 조회할 수 있는가?
- [x] (SFR-007) 사용자가 원하는 과정에 수강 신청을 할 수 있는가?
- [x] (SFR-010) 마이페이지에서 본인의 수강 신청 내역 (신청, 대기, 승인 등)을 확인할 수 있는가?
- [x] (SFR-010) 관리자에 의해 승인된 과정은 사용자가 임의로 취소할 수 없는가?

**Working Software 검증 완료:**
- [x] 과정 관리 시스템 완전 동작
- [x] 수강 신청 프로세스 완전 동작
- [x] 관리자 과정 관리 기능 동작
- [x] 사용자 마이페이지 동작
- [x] 과정 검색 및 필터링 동작

---

### Release 3: 게시판 및 커뮤니티 기능 (2주)

**목표:** 공지사항, Q&A 등 커뮤니티 기능을 통해 사용자 참여를 유도합니다.  
**상태:** 🔄 개발 중 (Q&A 게시판 완료)

| 구분 | 기능 명칭 | 요구사항 ID (SFR) | 개발 내용 | 인수 기준 |
| --- | --- | --- | --- | --- |
| **Backend** | 게시판 | SFR-003 | - Post, Comment 엔티티 및 Repository 설계<br>- 게시판 유형(공지사항, Q&A)에 따른 CRUD API 개발<br>- 파일 업로드/다운로드 기능 구현<br>- 비밀글 기능 및 권한 처리 | - 권한에 따라 게시글 작성/수정/삭제 가능<br>- Q&A 게시판에서 비밀글 작성 시 작성자와 관리자만 조회 가능<br>- 파일 첨부 및 다운로드 정상 동작 |
| **Frontend** | 게시판 | SFR-003 | - 게시판 목록, 상세, 작성/수정 페이지 UI 구현<br>- HTML 에디터(CKEditor, Toast UI Editor 등) 연동<br>- 파일 첨부 및 다운로드 기능 구현 | - 사용자가 게시글을 작성하고 목록에서 확인 가능<br>- 에디터를 통해 자유로운 형식의 콘텐츠 작성<br>- 비밀글 설정 시 자물쇠 아이콘 표시 |

**릴리즈 확인 체크리스트:**
- [ ] (SFR-003) 공지사항 목록 및 상세 내용을 조회할 수 있는가?
- [ ] (SFR-003) 관리자가 공지사항을 등록, 수정, 삭제할 수 있는가?
- [x] (SFR-003) Q&A 게시판에 질문을 등록할 수 있는가? (비밀글 포함)
- [x] (SFR-003) 본인이 작성한 비밀글과 그에 대한 답변을 조회할 수 있는가?
- [x] (SFR-003) 관리자가 모든 비밀글의 내용을 확인할 수 있는가?
- [ ] (SFR-003) 게시글 작성 시 파일을 첨부하고, 상세 페이지에서 다운로드할 수 있는가?

**Q&A 게시판 구현 완료 항목:**
- [x] Q&A 게시판 엔티티 설계 (Post, Comment, BoardType)
- [x] Q&A 게시판 CRUD API 구현
- [x] 비밀글 기능 및 권한 제어 구현
- [x] 댓글 시스템 구현
- [x] 검색 및 페이징 기능 구현
- [x] Q&A 게시판 프론트엔드 UI 구현
- [x] 권한 기반 게시글/댓글 수정/삭제 기능
- [x] 반응형 UI 및 사용자 친화적 인터페이스

---

### Release 4: 고급 기능 (설문, 평가) (3주)

**목표:** 설문조사 및 온라인 평가 기능을 구현하여 교육 과정의 질을 높입니다.  
**상태:** 🔄 개발 필요

| 구분 | 기능 명칭 | 요구사항 ID (SFR) | 개발 내용 | 인수 기준 |
| --- | --- | --- | --- | --- |
| **Backend** | 설문, 평가 | SFR-004, SFR-024, SFR-025, SFR-026, SFR-027 | - Survey, Question, Exam, Answer 엔티티 설계<br>- 설문 생성 및 응답 처리 API 개발<br>- 문제은행, 시험 출제, 자동 채점 API 개발<br>- 설문/시험 결과 통계 데이터 생성 | - 다양한 유형의 설문 문항 생성 가능<br>- 시험 응시 및 자동 채점 후 결과 즉시 확인<br>- 재응시 로직 및 제한 시간 기능 동작 |
| **Frontend** | 설문, 평가 응시 | SFR-004, SFR-026 | - 설문 응답 페이지 UI 구현<br>- 시험 응시 페이지 UI/UX 설계 (타이머, 문제 목록)<br>- 설문/시험 결과 확인 페이지 구현 | - 사용자가 설문 및 시험에 정상적으로 응시 가능<br>- 시험 응시 중 인터넷 연결 끊김 등 예외 상황 처리<br>- 결과 페이지에서 점수 및 정답/해설 확인 |

**릴리즈 확인 체크리스트:**
- [ ] (SFR-004) 관리자가 다양한 유형(선다형, 단답형 등)의 문항으로 설문을 생성할 수 있는가?
- [ ] (SFR-004) 특정 교육 과정을 이수한 학생을 대상으로 설문을 발송할 수 있는가?
- [ ] (SFR-004) 사용자가 설문에 응답을 제출할 수 있는가?
- [ ] (SFR-024, SFR-025) 관리자가 문제은행에서 문항을 선택하여 시험을 출제할 수 있는가?
- [ ] (SFR-026) 사용자가 PC/모바일 환경에서 시험에 응시할 수 있는가?
- [ ] (SFR-027) 시험 제출 시 자동으로 채점이 이루어지고 결과를 즉시 확인할 수 있는가?

---

### Release 5: 관리자 및 통계 기능 (2주)

**목표:** 시스템 운영을 위한 관리자 기능과 데이터 기반 의사결정을 위한 통계 기능을 완성합니다.  
**상태:** 🔄 개발 필요

| 구분 | 기능 명칭 | 요구사항 ID (SFR) | 개발 내용 | 인수 기준 |
| --- | --- | --- | --- | --- |
| **Backend** | 관리자 기능, 통계 | SFR-005, SFR-011, SFR-012, SFR-013, SFR-017, SFR-019 | - 관리자 대시보드 API 개발<br>- 회원, 협약사, 수강생 관리 API 보강<br>- 주요 데이터(회원, 과정, 매출 등) 통계 API 개발<br>- 엑셀 다운로드 기능 구현 | - 관리자가 회원 정보 수정 및 승인 처리 가능<br>- 기간별/조건별 통계 데이터 조회<br>- 통계 결과 엑셀 파일 다운로드 |
| **Frontend** | 통계 | SFR-017 | - 관리자 대시보드 UI 구현<br>- Chart.js 등 라이브러리를 이용한 통계 데이터 시각화<br>- 필터링 및 엑셀 다운로드 기능 연동 | - 대시보드에서 주요 현황을 차트로 확인<br>- 날짜, 과정 등 조건에 따라 데이터 필터링<br>- '엑셀 다운로드' 버튼 클릭 시 파일 생성 |

**릴리즈 확인 체크리스트:**
- [ ] (SFR-017) 관리자 대시보드에서 주요 현황(가입자 수, 과정 수 등)을 차트로 확인할 수 있는가?
- [ ] (SFR-012) 관리자가 전체 회원 목록을 조회하고, 정보를 수정하거나 승인/탈퇴 처리할 수 있는가?
- [ ] (SFR-013) 관리자가 협약사 신청을 승인/반려할 수 있는가?
- [ ] (SFR-017) 기간별, 과정별 등 다양한 조건으로 통계 데이터를 필터링할 수 있는가?
- [ ] (SFR-017) 조회된 통계 데이터를 엑셀 파일로 다운로드할 수 있는가?

---

## 프로젝트 현황 요약

### 전체 진행 상황
| Release | 기간 | 상태 | 완료율 | 주요 기능 |
|---------|------|------|--------|----------|
| **Release 1** | 1주 | ✅ 완료 | 100% | 사용자 인증, 기본 설정 |
| **Release 2** | 2주 | ✅ 완료 | 100% | 과정 관리, 수강 신청 |
| **Release 3** | 2주 | 🔄 개발 중 | 50% | 게시판, 커뮤니티 (Q&A 완료) |
| **Release 4** | 3주 | 🔄 개발 필요 | 0% | 설문, 평가 시스템 |
| **Release 5** | 2주 | 🔄 개발 필요 | 0% | 고급 관리, 통계 |
| **전체 프로젝트** | **10주** | **50% 완료** | **50%** | **완전한 LMS 시스템** |

### 구현 완료된 핵심 기능 (Release 1-3)
- ✅ **사용자 관리 시스템**: 회원가입, 로그인, 권한 관리 (SFR-008, SFR-009, SFR-011)
- ✅ **JWT 기반 인증**: 토큰 기반 보안 인증 (SFR-011)
- ✅ **과정 관리**: 과정 CRUD, 검색, 필터링 (SFR-007, SFR-018)
- ✅ **수강 신청 시스템**: 신청, 승인, 취소 프로세스 (SFR-007, SFR-010)
- ✅ **관리자 대시보드**: 사용자 관리, 과정 관리 (SFR-005, SFR-012)
- ✅ **Q&A 게시판**: 게시글/댓글 CRUD, 비밀글 기능 (SFR-003)
- ✅ **반응형 UI**: Bootstrap 기반 모던 웹 인터페이스 (SFR-001)
- ✅ **CI/CD 파이프라인**: GitHub Actions 자동화 (SFR-001)

### 다음 Sprint 권장사항
현재 Release 1-3이 부분 완료되었으므로, **Release 3의 남은 기능 (공지사항 게시판, 파일 업로드)**을 완료하는 것을 권장합니다.

#### 우선 개발 항목
1. ✅ **게시판 엔티티 설계** (Post, Comment, FileAttachment) - 완료
2. **공지사항 게시판 API** 개발 - 개발 필요
3. ✅ **Q&A 게시판 API** 개발 - 완료
4. **파일 업로드 서비스** 개발 - 개발 필요
5. ✅ **Q&A 게시판 UI 컴포넌트** 개발 - 완료

### Working Software 검증 완료 항목
- [x] **Release 1**: 사용자 인증 시스템 - 완전 동작 (SFR-008, SFR-009, SFR-011)
- [x] **Release 2**: 과정 관리 시스템 - 완전 동작 (SFR-007, SFR-010, SFR-018)
- [x] **Release 3**: Q&A 게시판 시스템 - 완전 동작 (SFR-003 부분)
- [ ] **Release 3**: 공지사항 게시판, 파일 업로드 - 개발 필요 (SFR-003 부분)
- [ ] **Release 4**: 설문/평가 시스템 - 개발 필요 (SFR-004, SFR-024~027)
- [ ] **Release 5**: 고급 관리 기능 - 개발 필요 (SFR-014~017)

이 업데이트된 계획을 바탕으로 체계적인 개발을 계속 진행하여 완전한 LMS 시스템을 구축할 수 있습니다.