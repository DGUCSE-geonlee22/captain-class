# CC · Captain Class — 공감 리더십 사내 교육 포털 프로토타입

> "누구나 캡틴이 될 수 있지만 아무나 리더가 될 수는 없다"
> "AI는 데이터의 맥락을, 리더는 마음의 맥락을 읽는다"

대학 수업 팀 프로젝트 **「AI 시대의 공감 리더십 솔루션 기획」** 발표 시연용 PC 웹 포털 프로토타입입니다.
백엔드와 실제 AI API는 쓰지 않습니다. 모든 AI 기능은 **미리 짠 시나리오·규칙 기반 목업**(`src/lib/mockAI.ts`)이며, 상태는 브라우저 `localStorage`에 저장됩니다.

- 기술 스택: React 19 + Vite + TypeScript + Tailwind CSS v4 + react-router-dom, 아이콘 lucide-react, 폰트 Pretendard(CDN)
- 화면 기준: 1440px (최소 1280px) PC 전용. 모바일 대응 없음.

---

## 1. 실행 방법

```bash
npm install
npm run dev        # http://localhost:5173
```

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
src/
  data/           # 모든 콘텐츠 (코드와 분리). 팀원은 이 폴더만 수정하면 됩니다.
  context/        # AppContext — 진척도·기록·마일리지 (localStorage 저장)
  lib/mockAI.ts   # 규칙 기반 목업 AI (유형 분류, 코칭 체크, 사례 매칭)
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
| 장한이 | 4~6주·11주 수업 내용 | `src/data/journey.ts` → `weekPlan` | `status: 'skeleton'` 행의 `topics`를 채우고 `'ready'`로 변경 |
| 장한이 | 코스 프레임(목표·핵심 질문·교육 목적·중심/보조 요소) | `src/data/courses.ts` → `framework` | 공감 축 코스와 같은 형식으로 채우면 코스 상세 상단에 표시됨 |
| **장한이** | Charisma+Character 코스 | `src/data/courses.ts` → `id: 'charisma-character'` | 위와 동일 |
| 장한이 | Coaching 코스 | `src/data/courses.ts` → `id: 'coaching'` | 위와 동일 |
| 장한이 | 대화 연습실 **힌트 문구**(질문형 리더 AI) | `src/data/hints.ts` | 시나리오 id(`helmet`/`peer`/`delay`)별 배열에 질문 추가. 원칙: 답을 주지 않고 질문만 |
| **곽경은** | 공감 축 콘텐츠 보강 | `src/data/logs.ts`(Reframing 로그), `lensPresets.ts`(관점 렌즈), `pulseCards.ts`(면담 카드), `quiz.ts`(퀵 테스트), `voice.ts`(음성 제보), `classes.ts`(전문가 수업) | 배열에 항목 추가 |
| 공통 | P난처 사례 DB · 커뮤니티 글 | `src/data/cases.ts` | `keywords`가 매칭 키. `scenarioId`를 넣으면 연습실로 연결 |
| 공통 | 대화 연습실 시나리오 | `src/data/scenarios.ts` | 턴마다 선택지 4유형 + 유형별 반응. `src/data/types.ts`의 `Scenario` 타입 참고 |
| 공통 | 익명 브릿지 고충·매칭 프로필 | `src/data/bridge.ts` | |
| **리워드 담당** | 마일리지 규칙 · 포상 제도 | `src/data/classes.ts` → `mileageRules`, `rewardPlaceholder` | 수료 화면(`src/pages/CompletionPage.tsx`)의 자리표시가 이 값을 읽음 |
| 공통 | 조직·인물 설정 | `src/data/team.ts` | 데모 사용자, A파트 구성원 |

새 화면이 필요하면 `src/pages`에 컴포넌트를 만들고 `src/App.tsx`의 `<Routes>`에 등록한 뒤, 레슨의 `path`를 그 경로로 지정하면 됩니다.

---

## 5. 디자인 노트

- 참고: 섹션 제목은 콘덴스드 영문(Barlow Condensed) + 짧은 포인트 밑줄 + 한국어 부제. 밝은 회청색 배경, 넉넉한 여백, 스크롤 진입 시 등장(`Reveal`).
- 팔레트: 남색 #1E2A4A(캡틴), 안전 주황 #F28C28(현장), 청록 #1F9E8F(공감), 피난처 전용 숲/불씨 톤(`forest-*`, `ember-*`).
- 이미지는 쓰지 않고 SVG 장면(`HeroScene`, `ForestScene`)과 CSS 애니메이션으로만 그렸습니다.

## 6. 모든 AI 목업에 적용한 공통 원칙

1. AI는 대리자가 아니라 조력자다. 메시지 대필, 자동 발송, 감정 확정 진단 기능은 없다.
2. AI 결과물에는 항상 **"참고용 · 최종 판단은 리더가"** 표시가 붙는다.
3. 개인정보·고객정보 입력 경고는 입력창 근처에 둔다.
4. 징계·처벌을 바로 실행하는 버튼은 어디에도 없다.
