# GitHub Pull Request(PR) 생성 및 푸시 가이드

Gemini CLI 환경에서 GitHub에 Pull Request(PR)를 생성하고 푸시하는 과정은 일반적인 Git 워크플로우를 따릅니다. 아래는 단계별 절차입니다.

### 1. 브랜치 생성 (Branch)

새로운 기능 추가나 버그 수정을 위한 전용 브랜치를 만듭니다. 이렇게 하면 `main`이나 `develop` 같은 주요 브랜치에 직접적인 영향을 주지 않고 안전하게 작업할 수 있습니다.

- **명령어:** `git checkout -b <새로운-브랜치-이름>`
- **예시:** `git checkout -b feature/add-login-page`

### 2. 코드 수정 및 추가 (Changes)

파일을 수정, 추가, 또는 삭제하여 원하는 작업을 수행합니다.

### 3. 변경사항 스테이징 (Stage)

커밋할 파일들을 선택하여 스테이징 영역(Staging Area)에 추가합니다.

- **특정 파일만 추가:** `git add <파일-경로>`
- **모든 변경사항 추가:** `git add .`

### 4. 커밋 (Commit)

스테이징된 변경사항을 하나의 작업 단위로 묶어 로컬 저장소에 저장하고, 해당 작업에 대한 설명을 커밋 메시지로 남깁니다.

- **명령어:** `git commit -m "여기에 커밋 메시지를 작성합니다"`
- **좋은 커밋 메시지 예시:** `feat: Add user login functionality`

### 5. 원격 저장소로 푸시 (Push)

로컬 브랜치에 저장된 커밋을 GitHub의 원격 저장소로 업로드합니다.

- **명령어:** `git push -u origin <새로운-브랜치-이름>`
- `-u` 옵션은 로컬 브랜치와 원격 브랜치를 연결해주어, 다음부터는 `git push`만 입력해도 됩니다.

### 6. Pull Request 생성 (Create Pull Request)

푸시가 완료되면 GitHub 웹사이트로 이동하여 Pull Request를 생성합니다.

1.  GitHub 저장소 페이지에 방문하면, 방금 푸시한 브랜치에 대해 PR을 생성하라는 안내가 나타납니다.
2.  `Compare & pull request` 버튼을 클릭합니다.
3.  PR의 제목과 상세 설명을 작성한 후, `Create pull request` 버튼을 눌러 생성을 완료합니다.

---

### 요약

**`브랜치 생성` -> `코드 수정` -> `스테이징` -> `커밋` -> `푸시` -> `PR 생성`** 순서로 진행됩니다.
