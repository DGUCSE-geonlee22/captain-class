# CC · Captain Class — 공감 리더십 사내 교육 포털 프로토타입

> "누구나 캡틴이 될 수 있지만 아무나 리더가 될 수는 없다"
> "AI는 데이터의 맥락을, 리더는 마음의 맥락을 읽는다"

대학 수업 팀 프로젝트 **「AI 시대의 공감 리더십 솔루션 기획」** 발표 시연용 PC 웹 포털 프로토타입입니다.
실제 AI API는 쓰지 않습니다. 모든 AI 기능은 **규칙 기반 목업**(`src/lib/mockAI.ts`, 서버판 `server/rules.mjs`)입니다.

- **프론트만 띄우면 로컬 모드**: 기록은 브라우저 `localStorage`에만 저장됩니다. (GitHub Pages 배포가 이 상태)
- **백엔드(`server/`)를 함께 띄우면 서버 모드**: 이름+PIN 로그인, 사용자별 기록 서버 저장·동기화, P난처 사례·리더 솔루션 공유, 익명 브릿지 고충 보내기·답변 공유, 캡틴 랭킹이 켜집니다. 헤더 왼쪽 구름 아이콘이 연결 상태를 보여 줍니다.

- 기술 스택: React 19 + Vite + TypeScript + Tailwind CSS v4 + react-router-dom, 아이콘 lucide-react, 폰트 Pretendard(CDN)
- 화면 기준: 1440px (최소 1280px) PC 전용. 모바일 대응 없음.

---

## 1. 실행 방법

```bash
npm install
npm run dev        # 프론트 http://localhost:5173 (로컬 모드)
```

백엔드까지 함께 실행하려면 터미널을 하나 더 열어 서버를 띄웁니다. Vite가 `/api` 요청을 8787 포트로 넘겨 주므로 프론트 주소는 그대로입니다.

```bash
npm run server     # API http://localhost:8787/api/health  (Node 22.13+ 또는 24, 내장 SQLite 사용)
```

- 로그인: 헤더 오른쪽 **로그인** 버튼 → 이름 + 숫자 4자리 PIN. 처음 쓰는 이름이면 자동 가입됩니다.
- 데모 계정(PIN 0000): `이하영`(캡틴), `정소장`·`윤팀장`·`한팀장`(리더). 리더만 P난처 솔루션·커뮤니티 글을 쓸 수 있습니다.
- API 통합 테스트: 서버를 띄운 뒤 `node server/test-api.mjs` (27개 항목).

```bash
npm run build      # 타입 체크 + 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
```

- 헤더 오른쪽 **데모 주차** 드롭다운(0~13주) 또는 홈·커리큘럼의 주차 눈금을 누르면 이번 주 수업·현업 미션·커리큘럼 표·2축 진척도가 바뀝니다. 기본값은 **8주차(Act 단계)**입니다.
- 화면 **우측 하단의 불씨 버튼**이 P난처(피난처) 입구입니다. 누르면 숲속 모닥불 장면으로 전환되며 상황 입력 화면이 열립니다.
- 13주차로 바꾸면 '리더' 직급 상태가 되어 P난처 **솔루션 작성**과 수료 배지가 열립니다.
- 헤더 맨 오른쪽 ↺ 버튼으로 데모 데이터(기록·마일리지·진척도)를 초기화할 수 있습니다.

---

## 2. 발표 시연 시나리오 (권장 순서)

| # | 화면 | 보여줄 것 |
|---|---|---|
| 1 | **홈** `/` | 풀스크린 히어로(CAPTAIN CLASS) → ABOUT(철학 세로 텍스트 패널) → MY VOYAGE(주차 스트립·이번 주 수업·미션·진척도) → CURRICULUM(주차별 표) → 5C COURSES → FEATURES → SIGNALS |
| 2 | 헤더 **데모 주차** 변경 또는 주차 눈금 클릭 | 2주차·12주차·13주차로 바꾸며 수업·미션·표·진척도가 바뀌는 것 확인 → 다시 8주차 |
| 2-1 | **커리큘럼** `/curriculum` | 0~13주 주차별 코스·수업 내용·레슨 링크·현업 미션·산출물·상태(수강 완료/이번 주/예정/준비 중) 표 |
| 3 | **우측 하단 불씨 → P난처** `/pnancheo` | 피난처 전환 애니메이션 → "폭염에 안전모를 올린 작업반장이 AI 경고를 받고 반발합니다" 입력 → 관점 렌즈 질문(리더/구성원) → 선배 리더 이야기 카드(도움돼요) → 솔루션 작성은 리더 전용 잠금 |
| 4 | 사례 카드의 **「이 상황 연습하기」** | 대화 연습실 '고참 작업반장의 안전모 반발' 시나리오로 이동 |
| 5 | **캡틴 대화 연습실** `/practice?scenario=helmet` | 3턴 분기 대화. 선택지 또는 직접 입력(키워드 매칭) → 오른쪽 지수(공감도·명확성·심리적 안전감) 실시간 변화 → **힌트** 버튼(답 대신 질문) → 종료 리포트(체크리스트 + 문장 교정 가이드) |
| 6 | **「실제 면담·TBM 후 기록하기」** | 실천 Log 양식(대화 목적/사용한 표현/상대 반응/다음에 바꿀 점) 저장 |
| 7 | **내 기록** `/records?tab=practice` | 방금 저장한 실천 Log 확인. '2축 진단' 탭에서 사전 vs 현재 비교 |
| 8 | **Compassion 레슨 A** `/course/compassion/reframing` | 데이터 융합 → 로그 Reframing → 10초 생각의 시간(입력 잠금) → 신호 노트 저장 |
| 9 | **Collab+Comm 레슨 D** `/course/collab-comm/coaching` | 반려문 초안 → 코칭 포인트 3가지(대필 없음) → 직접 수정 → 비포/애프터 저장 |
| 10 | **익명 브릿지** `/bridge` | 받은 고충(배지 2종) → 상담 체험(답변 후 코칭 포인트 체크) → 브릿지 매칭(협업 합의서) |
| 11 | **5C 코스** `/courses` → Compassion 상세 | 공감 축 철학 배너(듣기→이해→소통→협업 행동), 2축 2열 + Construction 띠. 코스 상세에는 목표·핵심 질문·교육 목적, Reframing 3단계 도식, 중심 요소/보조 수단 구분. 뼈대 코스 3개는 '준비 중 · 담당' 상태로 열림 |
| 12 | **수료/리워드** `/completion` | 마일리지 내역, 리워드 체계 자리표시, (13주차에서) 리더 배지 |

핵심 흐름 **홈 → P난처 → 유사 사례 → 대화 연습실 완주 → 리포트 → 실천 Log 저장 → 내 기록**은 끊김 없이 이어집니다.

---

## 3. 폴더 구조

```
server/
  index.mjs       # Express 5 API + 정적 프론트 서빙 (dist/ 있을 때)
  rules.mjs       # 규칙 기반 목업 AI (서버판) — 실제 AI로 바꾸려면 이 파일만 교체
  seed.json       # 초기 데이터 (npm run seed:export 로 src/data 에서 재생성)
  test-api.mjs    # API 통합 테스트
  data/           # SQLite 파일 (git 제외)
src/
  data/           # 모든 콘텐츠 (코드와 분리). 팀원은 이 폴더만 수정하면 됩니다.
  context/        # AppContext — 진척도·기록·마일리지 (localStorage 저장)
  lib/mockAI.ts   # 규칙 기반 목업 AI (유형 분류, 코칭 체크, 사례 매칭)
  lib/api.ts      # 백엔드 API 클라이언트 (주소 결정·토큰)
  lib/shared.ts   # 공유 데이터 훅 — 서버 있으면 서버, 없으면 로컬 목업을 같은 모양으로 반환
  components/     # Layout(헤더·우측 하단 피난처 버튼·전환), Curriculum(주차 스트립·표), HeroScene/ForestScene(SVG 장면), ui(SectionHead·Reveal 등)
  pages/          # 화면
    compassion/   # Reframing, 관점 렌즈, 전문가 수업
    collab/       # 퀵 테스트, 펄스 카드, 반려문 코칭, 현장 직통 보이스
```

---

## 4. 담당자별로 채워야 할 데이터 파일

| 담당 | 채울 내용 | 파일 | 방법 |
|---|---|---|---|
| **주우상** | Construction 코스 (기초 역량) | `src/data/courses.ts` → `id: 'construction'` | `status`를 `'ready'`로, `lessons` 3개를 실제 레슨(title/summary/path)으로 교체, `description` 작성 |
| 주우상 | Construction 배치 주차 | `src/data/journey.ts` → `construction`, `weekPlan` | `weeks: 'TBD'`를 실제 주차로 바꾸고 `weekPlan`에 해당 주차 행을 추가 |
| 장한이 | 코스 프레임(목표·핵심 질문·교육 목적·중심/보조 요소) | `src/data/courses.ts` → `framework` | 공감 축 코스와 같은 형식으로 채우면 코스 상세 상단에 표시됨 |
| **장한이** | Charisma+Character (구현됨) | `src/data/leaderAI.ts`, `src/data/courses.ts` | 안내자(guides)·시나리오·참고 자료·되묻기 질문 추가, AI 위임 업무 목록 수정 |
| 장한이 | Coaching (구현됨) | `src/data/coaching.ts` | 코칭 면담 주제, 질문 점검 규칙, 성취 기록 항목, KCA 안내 수정 |
| 장한이 | 대화 연습실 **힌트 문구**(질문형 리더 AI) | `src/data/hints.ts` | 시나리오 id(`helmet`/`peer`/`delay`)별 배열에 질문 추가. 원칙: 답을 주지 않고 질문만 |
| **곽경은** | 공감 축 콘텐츠 보강 | `src/data/logs.ts`(Reframing 로그), `lensPresets.ts`(관점 렌즈), `pulseCards.ts`(면담 카드), `quiz.ts`(퀵 테스트), `voice.ts`(음성 제보), `classes.ts`(전문가 수업) | 배열에 항목 추가 |
| 공통 | P난처 사례 DB · 커뮤니티 글 | `src/data/cases.ts` | `keywords`가 매칭 키. `scenarioId`를 넣으면 연습실로 연결 |
| 공통 | 대화 연습실 시나리오 | `src/data/scenarios.ts` | 턴마다 선택지 4유형 + 유형별 반응. `src/data/types.ts`의 `Scenario` 타입 참고 |
| 공통 | 익명 브릿지 고충·매칭 프로필 | `src/data/bridge.ts` | |
| **리워드 담당** | 마일리지 규칙 · 포상 제도 | `src/data/classes.ts` → `mileageRules`, `rewardPlaceholder` | 수료 화면(`src/pages/CompletionPage.tsx`)의 자리표시가 이 값을 읽음 |
| 공통 | 조직·인물 설정 | `src/data/team.ts` | 데모 사용자, A파트 구성원 |

새 화면이 필요하면 `src/pages`에 컴포넌트를 만들고 `src/App.tsx`의 `<Routes>`에 등록한 뒤, 레슨의 `path`를 그 경로로 지정하면 됩니다.

---

## 5. 백엔드 API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/health` | 서버 상태·버전·건수 |
| POST | `/api/auth/login` | `{name, pin, initialState?}` → 토큰. 없는 이름은 자동 가입(캡틴) |
| POST | `/api/auth/logout` | 토큰 폐기 |
| GET / PUT | `/api/me`, `/api/me/state` | 내 정보, 내 기록 상태(JSON 블롭) 저장·복원 |
| GET / POST | `/api/cases` | P난처 사례 목록(시드+사용자) / 새 상황 등록 |
| POST | `/api/cases/:id/helpful` | 도움돼요 토글 |
| POST | `/api/cases/:id/solutions` | 리더 전용 솔루션 등록 |
| GET / POST | `/api/posts` | 커뮤니티 글 / 리더 전용 글쓰기 |
| GET / POST | `/api/grievances` | 익명 고충 목록 / 고충 보내기 (작성자 식별 정보는 응답에 포함되지 않음) |
| POST | `/api/grievances/:id/answers` | 익명 답변 (본인 고충에는 불가, 코칭 포인트 3가지 자동 점검) |
| GET | `/api/leaderboard` | 마일리지·기록 수 기준 캡틴 랭킹 |
| POST | `/api/ai/classify`, `/api/ai/coach` | 규칙 기반 AI 서버판 |
| POST | `/api/admin/reset` | `x-admin-key` 헤더(ADMIN_KEY) 필요. DB를 시드 상태로 초기화 |

보안 수준은 수업 데모용입니다. PIN은 scrypt 해시로 저장하고 토큰은 랜덤 세션이지만, 요청 제한·이메일 인증 같은 운영 수준 보호는 없습니다.

### 백엔드 배포 (Render 무료 플랜 기준)

1. GitHub에 push 되어 있어야 합니다 (`render.yaml`, `.node-version` 포함).
2. https://dashboard.render.com → **New → Blueprint** → 이 저장소 선택 → Apply. 빌드 `npm ci && npm run build`, 시작 `npm start`가 자동 설정됩니다.
3. 배포가 끝나면 `https://<서비스이름>.onrender.com` 하나로 프론트와 API가 함께 열립니다. 이 주소를 공유하면 됩니다.
4. GitHub Pages 주소를 계속 쓰고 싶으면 `.env.production`에 `VITE_API_URL=https://<서비스이름>.onrender.com`을 적고 `npm run deploy`를 다시 실행합니다. 그러면 Pages 프론트가 Render API에 붙습니다.

알아 둘 점: 무료 플랜은 15분 동안 요청이 없으면 잠들어 첫 접속이 30초쯤 느릴 수 있고, 재배포·재시작 시 디스크가 초기화되어 DB가 시드 상태로 돌아갑니다. 영구 보관이 필요하면 유료 디스크를 붙여 `DATABASE_PATH`를 그 경로로 지정합니다. Docker를 쓰는 곳이라면 `Dockerfile`을 그대로 쓰면 됩니다.

## 6. 디자인 노트

- 참고: 섹션 제목은 콘덴스드 영문(Barlow Condensed) + 짧은 포인트 밑줄 + 한국어 부제. 밝은 회청색 배경, 넉넉한 여백, 스크롤 진입 시 등장(`Reveal`).
- 팔레트: 남색 #1E2A4A(캡틴), 안전 주황 #F28C28(현장), 청록 #1F9E8F(공감), 피난처 전용 숲/불씨 톤(`forest-*`, `ember-*`).
- 이미지는 쓰지 않고 SVG 장면(`HeroScene`, `ForestScene`)과 CSS 애니메이션으로만 그렸습니다.

## 7. 모든 AI 목업에 적용한 공통 원칙

1. AI는 대리자가 아니라 조력자다. 메시지 대필, 자동 발송, 감정 확정 진단 기능은 없다.
2. AI 결과물에는 항상 **"참고용 · 최종 판단은 리더가"** 표시가 붙는다.
3. 개인정보·고객정보 입력 경고는 입력창 근처에 둔다.
4. 징계·처벌을 바로 실행하는 버튼은 어디에도 없다.
