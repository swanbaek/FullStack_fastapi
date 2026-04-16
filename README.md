# FullStack React + FastAPI + JWT Example

이 프로젝트는 React.js(프론트엔드)와 FastAPI(백엔드), JWT 인증을 활용하여 회원가입, 로그인, 회원목록(Admin), 마이페이지 기능을 구현한 풀스택 예제입니다.

## 폴더 구조

```
best-app/        # React.js 프론트엔드
best-server/     # FastAPI 백엔드
```

---

## 주요 기능

### 1. 회원가입
- 사용자는 회원가입 폼을 통해 계정을 생성할 수 있습니다.
- 프론트엔드: `src/components/users/SignUp.jsx`
- 백엔드: `/api/member.py`, `/schemas/member_schema.py`

### 2. 전체 회원목록 보기 (Admin)
- 관리자는 전체 회원 목록을 조회할 수 있습니다.
- 프론트엔드: `src/components/users/MemberList.jsx`
- 백엔드: `/api/member.py`, `/crud/member_model.py`

### 3. JWT 로그인 인증 및 인가
- 사용자는 로그인 시 JWT 토큰을 발급받아 인증 및 인가 처리를 합니다.
- 프론트엔드: `src/components/users/LoginModal.jsx`, `src/stores/authStore.js`, `src/api/axiosAuthInstance.js`
- 백엔드: `/api/auth.py`, `/core/jwt_handler.py`, `/core/deps.py`

### 4. 마이페이지 (MyPage)
- 사용자는 자신의 정보를 확인/수정할 수 있습니다.
- 프론트엔드: `src/components/users/MyPage.jsx`
- 백엔드: `/api/member.py`, `/schemas/member_schema.py`

---

## 실행 방법

### 1. 백엔드(FastAPI) 실행

```bash
cd best-server
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. 프론트엔드(React) 실행

```bash
cd best-app
npm install
npm run dev
```

---

## 환경 변수 및 설정
- 백엔드 환경 변수: `best-server/core/config.py` 참고
- 프론트엔드 API 주소 등은 `best-app/src/api/axiosInstance.js`에서 설정

---

## 기타
- DB 스키마: `best-server/members.sql`
- 추가적인 기능 및 상세 구현은 각 폴더 내 파일 참고

---

## 문의
- 개선사항 및 문의는 이슈로 남겨주세요.
