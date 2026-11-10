/**
 * 주차별 강의 커리큘럼 (온라인 강의 형식)
 *
 * 구조: 주차마다 ① 강의 영상(코스가 제공하는 강의) → ② 확인 활동(5C 실습 기능으로 잘 받아들였는지 확인) → ③ 현업 과제
 * 코스별 강의 제공 주체 (팀 문서 기준)
 *  - Construction: 현장 업종의 큰 흐름, 관리감독 역량을 뒷받침하는 강의
 *  - Compassion: HRD 부서 심리전문가 강의
 *  - Collaboration+Communication: 분야별 전문가 강의 (경청·전달력 / 문서화·회의 운영·피드백 / AI 시대 사람이 사람을 돕는 법)
 *  - Charisma+Character: 역사·스포츠·콘텐츠 속 리더의 리더십 강의
 *  - Coaching: 한국코치협회 연계 교육 영상
 * 실제 영상은 없고, 썸네일·플레이어는 강의 영상임을 알아볼 수 있게 그린 목업이다.
 * ▶ 담당자는 강의 제목·요약·챕터·핵심 노트를 이 파일에서 고친다.
 */
import type { CourseId } from './types'

export interface Lecture {
  id: string
  title: string
  instructor: string
  /** mm:ss */
  duration: string
  summary: string
  chapters: { at: string; title: string }[]
  notes: string[]
}

export interface WeekLectures {
  week: number
  courseId: CourseId
  /** 이 주의 강의 주제 */
  theme: string
  /** 강의 제공 주체 */
  provider: string
  lectures: Lecture[]
  /** 확인 활동 (5C 실습 기능) — 완료하면 통과 */
  check: { lessonId?: string; label: string; desc: string; path: string }
}

export const courseVisual: Record<CourseId, { label: string; from: string; to: string; accent: string }> = {
  construction: { label: 'Construction', from: '#7c2d12', to: '#F28C28', accent: '#fdba74' },
  compassion: { label: 'Compassion', from: '#0f3d3a', to: '#1F9E8F', accent: '#99f6e4' },
  'collab-comm': { label: 'Collaboration + Communication', from: '#0c4a6e', to: '#0ea5a4', accent: '#a5f3fc' },
  'charisma-character': { label: 'Charisma + Character', from: '#10172a', to: '#3a4c78', accent: '#fcd34d' },
  coaching: { label: 'Coaching', from: '#312e81', to: '#6366f1', accent: '#c7d2fe' },
}

export const weekLectures: WeekLectures[] = [
  {
    week: 0, courseId: 'construction', theme: '오리엔테이션 · 현장 업종의 큰 흐름', provider: '현장소장·공무 실무 강사',
    lectures: [
      { id: 'L0-1', title: '건설 현장은 어떻게 움직이는가 — 발주처·원도급·하도급', instructor: '현장소장 (사내 강사)', duration: '16:40', summary: '다단계 구조에서 원도급사 신임 리더가 본사 지시, 발주처 요구, 협력사 현실을 중간에서 받는 이유를 짚습니다.', chapters: [{ at: '00:00', title: '건설 프로젝트의 참여자들' }, { at: '05:20', title: '원도급사 신임 리더의 위치' }, { at: '11:05', title: '공무 담당은 현장의 코디네이터' }], notes: ['원도급사는 기획·시공·일정·예산을 총괄한다', '신임 리더는 본사·발주처·협력사 사이에서 양방향으로 소통하고 조율한다', '공무 직무는 본사 보고, 발주처 협의, 협력사 정산을 겸한다'] },
      { id: 'L0-2', title: '원가·안전·공기, 삼중 압박 속의 관리감독', instructor: '안전관리자 · 공무팀장 (사내 강사)', duration: '18:15', summary: '원가율 상승, 중대재해처벌법, 준공 압박이 동시에 작용하는 환경에서 관리감독자가 놓치면 안 되는 것을 다룹니다.', chapters: [{ at: '00:00', title: '원가 압박: 원가율 90%의 의미' }, { at: '06:10', title: '안전 책임: 중대재해처벌법과 현장-본사 소통' }, { at: '12:30', title: '공기 압박과 작업중지권' }], notes: ['세 압박은 동시에 온다. 하나만 보면 나머지에서 사고가 난다', '현장의 위험 정보가 본사 경영진까지 제때 닿아야 한다', '작업중지권은 공기 손실이 아니라 안전 투자라는 관점'] },
      { id: 'L0-3', title: '모니터 앞의 리더, 현장 바닥의 리더', instructor: 'HRD팀', duration: '09:30', summary: 'AI CCTV·IoT 로그만 믿는 통제 관리가 왜 반발·위험 은폐·소통 기피를 낳는지, 0주차 진단과 현장 미션을 안내합니다.', chapters: [{ at: '00:00', title: '기술과 사람 사이의 갈등' }, { at: '04:40', title: '0주차 진단과 현장 미션 안내' }], notes: ['로그는 행동을 보여주지만 이유는 보여주지 않는다', '첫 주에 현장 작업자 1명에게 직접 묻는다'] },
    ],
    check: { lessonId: 'cn-a', label: '2축 자기진단 + 내 딜레마', desc: '건설 현장 상황 8가지에서 나의 대응 성향을 진단합니다.', path: '/course/construction/diagnosis' },
  },
  {
    week: 1, courseId: 'compassion', theme: 'Compassion이란 무엇인가', provider: 'HRD 부서 심리전문가',
    lectures: [
      { id: 'L1-1', title: 'Compassion — 공감을 넘어 함께 해결하려는 마음', instructor: 'HRD팀 심리전문가', duration: '15:20', summary: 'a strong feeling of sympathy and sadness for the suffering of others and a wish to help them. 단순한 공감이 아니라 고통을 함께 느끼고 함께 해결하려는 마음이 왜 AI 시대에 더 중요한지 다룹니다.', chapters: [{ at: '00:00', title: 'Compassion의 사전적 정의' }, { at: '04:50', title: '공감(Empathy)과 연민(Compassion)의 차이' }, { at: '10:10', title: '관계가 단절되는 AI 시대의 리더' }], notes: ['느끼는 것에서 끝나지 않고 돕고자 하는 마음까지', '구성원의 고통을 그 사람의 입장에서 이해한다', '이해한 뒤에는 솔루션을 함께 찾는다'] },
      { id: 'L1-2', title: '데이터 뒤의 사람 읽기', instructor: 'HRD팀 심리전문가', duration: '13:45', summary: '[규정 위반: 안전모 착용 불량] 같은 차가운 로그를 체감온도·연속 작업 시간이 담긴 맥락으로 다시 읽는 연습을 합니다.', chapters: [{ at: '00:00', title: '차가운 로그가 리더에게 주는 착각' }, { at: '05:30', title: '환경 데이터로 행동의 배경 보기' }, { at: '09:40', title: '판단 전 생각의 시간' }], notes: ['벌점 로그보다 환경 데이터를 먼저 본다', '작업자는 관리 대상이 아니라 사정이 있는 사람이다'] },
    ],
    check: { lessonId: 'cp-a', label: '현장 공감형 Reframing', desc: 'AI 경고 로그 하나를 맥락으로 다시 읽고 신호 노트를 씁니다.', path: '/course/compassion/reframing' },
  },
  {
    week: 2, courseId: 'compassion', theme: '판단 전에 관점 확인하기', provider: 'HRD 부서 심리전문가',
    lectures: [
      { id: 'L2-1', title: '내 해석을 사실로 착각하지 않기', instructor: 'HRD팀 심리전문가', duration: '14:05', summary: '리더가 자신의 관점만으로 상황을 판단할 때 생기는 오해를 사례로 살펴봅니다.', chapters: [{ at: '00:00', title: '같은 장면, 다른 해석' }, { at: '06:00', title: '리더 입장과 구성원 입장 나란히 놓기' }], notes: ['감정을 단정하지 않는다 ("화가 났다" 대신 "무엇이 보이는가")', '리더 쪽은 책임과 제약, 구성원 쪽은 인정과 기준의 명확성을 본다'] },
      { id: 'L2-2', title: '질문으로 관점을 넓히는 법', instructor: 'HRD팀 심리전문가', duration: '11:30', summary: '"구성원은 어떤 기준을 충분히 전달받지 못했을까?"처럼 관점을 탐색하는 질문을 만들어 봅니다.', chapters: [{ at: '00:00', title: '닫힌 판단, 열린 질문' }, { at: '05:15', title: '양쪽 입장 질문 만들기 실습' }], notes: ['질문은 정답이 아니라 관점을 넓히는 도구다'] },
    ],
    check: { lessonId: 'cp-b', label: '관점 렌즈', desc: '갈등 상황 하나를 리더·구성원 양쪽 질문으로 살핍니다.', path: '/course/compassion/lens' },
  },
  {
    week: 3, courseId: 'compassion', theme: '구성원의 고통을 듣는 리더', provider: 'HRD 부서 심리전문가',
    lectures: [
      { id: 'L3-1', title: '구성원이 겪는 고통의 유형 — 압박·고립·불안', instructor: 'HRD팀 심리전문가', duration: '16:00', summary: '성과 압박, 소통 단절, 위축과 긴장 등 부하직원이 겪을 수 있는 고통을 그 사람의 입장에서 이해합니다.', chapters: [{ at: '00:00', title: '숫자 뒤에 숨은 개인 고충' }, { at: '07:20', title: '말하지 못하는 이유' }, { at: '12:00', title: '심리적 안전감' }], notes: ['지연 경고 뒤에 개인 사정이 있을 수 있다', '말해도 괜찮다는 신호는 리더가 먼저 보낸다'] },
      { id: 'L3-2', title: '고충을 들을 때 리더의 태도', instructor: 'HRD팀 심리전문가', duration: '12:40', summary: '익명 고충에 답할 때 노력을 인정하고, 문제를 구체적으로 짚고, 개선 방향을 함께 찾는 방법을 다룹니다.', chapters: [{ at: '00:00', title: '위로와 해결 사이' }, { at: '06:30', title: '답변의 3가지 포인트' }], notes: ['인정 · 구체적 설명 · 개선 방향', '익명성은 끝까지 지킨다'] },
    ],
    check: { lessonId: 'cp-c', label: '타 파트 익명 상담 체험', desc: '다른 파트 구성원의 고충 하나에 직접 답변합니다.', path: '/bridge?tab=consult' },
  },
  {
    week: 4, courseId: 'charisma-character', theme: '역사 속 리더에게 배우는 카리스마', provider: '리더십 사례 강의',
    lectures: [
      { id: 'L4-1', title: '리더십은 지위가 아니라 행동이다 — 이순신', instructor: 'CC 리더십 강사', duration: '17:25', summary: '솔선수범, 책임, 원칙, 준비, 부하 보호. 명량해전·난중일기·한산도 대첩으로 본 이순신의 리더십.', chapters: [{ at: '00:00', title: '말보다 행동으로 얻은 신뢰' }, { at: '06:40', title: '난중일기 — 기록하는 리더' }, { at: '12:10', title: '12척과 명량: 준비와 책임' }], notes: ['원칙에는 엄격하고 책임에는 끝까지 충실하다', '용기만큼 준비와 실력을 중시한다'] },
      { id: 'L4-2', title: '듣는 왕, 품는 리더 — 세종대왕과 링컨', instructor: 'CC 리더십 강사', duration: '14:10', summary: '반대 의견까지 끝까지 들은 세종, 라이벌로 내각을 꾸린 링컨. 경청과 포용이 만드는 카리스마.', chapters: [{ at: '00:00', title: '반대 의견을 듣는 리더' }, { at: '07:00', title: '라이벌의 팀' }], notes: ['카리스마는 목소리 크기가 아니라 신뢰에서 나온다'] },
    ],
    check: { lessonId: 'ch-a', label: '리더 카드 도감', desc: '닮고 싶은 리더 카드를 골라 성격과 리더십을 살펴봅니다.', path: '/course/charisma-character/leaders' },
  },
  {
    week: 5, courseId: 'charisma-character', theme: '스포츠 팀의 주장들', provider: '리더십 사례 강의',
    lectures: [
      { id: 'L5-1', title: '팀을 먼저 빛나게 한 리더 — 빌 러셀과 조던', instructor: 'CC 리더십 강사', duration: '15:50', summary: '11번 우승한 러셀의 팀 우선 리더십과 높은 기준으로 팀을 끌어올린 조던. 두 리더의 다른 방식을 비교합니다.', chapters: [{ at: '00:00', title: '보이지 않는 일을 하는 리더' }, { at: '08:00', title: '기준을 끌어올리는 리더' }], notes: ['같은 결과, 다른 리더십: 팀 우선 vs 높은 기준'] },
      { id: 'L5-2', title: '위기의 주장 — 제라드, 푸욜, 히딩크', instructor: 'CC 리더십 강사', duration: '13:35', summary: '0:3에서 흐름을 바꾼 주장, 동료를 존중하게 만든 주장, 연공서열을 깨고 기본기를 세운 감독.', chapters: [{ at: '00:00', title: '이스탄불의 기적' }, { at: '05:40', title: '트로피를 동료에게' }, { at: '09:30', title: '2002년, 서열보다 역할' }], notes: ['위기에는 먼저 뛰는 한 사람이 흐름을 바꾼다'] },
    ],
    check: { lessonId: 'ch-b', label: '리더 AI에게 묻기', desc: '실제 고민 하나를 리더 카드를 골라 물어봅니다.', path: '/course/charisma-character/leader-ai' },
  },
  {
    week: 6, courseId: 'charisma-character', theme: '콘텐츠 속 리더와 나의 리더십', provider: '리더십 사례 강의',
    lectures: [
      { id: 'L6-1', title: '가족을 지키는 선장 — 흰수염과 루피', instructor: 'CC 리더십 강사', duration: '16:15', summary: '구성원을 가족으로 대하고 위기에 가장 앞장선 흰수염, 동료를 믿고 맡기는 루피. 따르게 만드는 리더와 따르고 싶은 리더.', chapters: [{ at: '00:00', title: '마린포드 정상전쟁' }, { at: '07:30', title: '에이스를 받아들인 포용력' }, { at: '11:50', title: '맡기는 선장, 루피' }], notes: ['진정한 리더는 따르라고 요구하는 사람이 아니라 따르고 싶어지는 사람', '권위는 지위가 아니라 행동과 책임에서 나온다'] },
      { id: 'L6-2', title: '나에게 맞는 리더십 찾기', instructor: 'CC 리더십 강사', duration: '10:20', summary: '여러 리더의 조언을 비교하며 내 상황에 맞는 리더십을 고르고, 최종 판단은 스스로 내리는 연습을 합니다.', chapters: [{ at: '00:00', title: '정답 리더는 없다' }, { at: '05:00', title: '조언을 비교하고 결정하기' }], notes: ['AI 리더의 조언은 참고, 판단은 캡틴이'] },
    ],
    check: { lessonId: 'ch-b', label: '여러 리더의 조언 비교', desc: '같은 고민을 2명 이상의 리더 AI에게 묻고 내 결정을 기록합니다.', path: '/course/charisma-character/leader-ai' },
  },
  {
    week: 7, courseId: 'collab-comm', theme: '소프트 스킬 — 경청과 전달력', provider: '커뮤니케이션 분야 전문가',
    lectures: [
      { id: 'L7-1', title: '접힌 문장을 듣는 경청', instructor: '커뮤니케이션 전문가', duration: '14:30', summary: '"그건 됐고요"처럼 상대가 접은 말 뒤의 진짜 어려움을 듣는 법. 듣고 이해한 것을 다시 말해 확인합니다.', chapters: [{ at: '00:00', title: '들리는 말, 들어야 할 말' }, { at: '06:20', title: '요약해서 되묻기' }], notes: ['마무리 문장보다 접힌 문장에 주목한다'] },
      { id: 'L7-2', title: '존중하면서 기준을 분명히 전달하기', instructor: '커뮤니케이션 전문가', duration: '13:10', summary: '부드럽게만 말하는 것이 목표가 아닙니다. 상대를 존중하면서 필요한 기준을 분명히 전달하는 화법.', chapters: [{ at: '00:00', title: '통제형·회피형·공감+명확형' }, { at: '07:40', title: '한 문장에 공감과 기준 담기' }], notes: ['조건을 함께 만들겠다는 약속과 기준을 한 문장에'] },
    ],
    check: { lessonId: 'cc-a', label: '캡틴 대화 연습실', desc: '시나리오 하나를 끝까지 대화하고 리포트를 확인합니다.', path: '/practice' },
  },
  {
    week: 8, courseId: 'collab-comm', theme: '실무 역량 — 피드백과 문서화', provider: '실무 분야 전문가',
    lectures: [
      { id: 'L8-1', title: '노력은 인정하고 문제는 구체적으로 — 피드백의 3요소', instructor: '조직 피드백 전문가', duration: '15:45', summary: '"보고서에 오류가 너무 많아 수정 부탁드립니다" 대신, 노력 인정 · 구체적 문제 · 개선 방향을 담는 피드백.', chapters: [{ at: '00:00', title: '배려와 명확함의 딜레마' }, { at: '05:30', title: '피드백 3요소' }, { at: '11:00', title: '반려문을 고쳐 쓰는 연습' }], notes: ['노력 인정 · 구체적 설명 · 개선 방향', 'AI가 대신 써 주는 문장은 내 관계에 맞지 않는다'] },
      { id: 'L8-2', title: '현장 문서화 — 기록이 설득이 된다', instructor: '공무 실무 전문가', duration: '11:55', summary: '작업일보, 위험 기록, 현장 맥락 보고서. 본사를 설득하는 근거는 현장의 기록에서 나옵니다.', chapters: [{ at: '00:00', title: '무엇을 기록할 것인가' }, { at: '06:10', title: '현장 맥락 보고서 쓰기' }], notes: ['로그에 시각·체감온도·연속 작업 시간을 붙인다'] },
    ],
    check: { lessonId: 'cc-d', label: '반려문 코칭 · 비포/애프터', desc: '반려·지적 문장 하나를 직접 고쳐 비포/애프터로 저장합니다.', path: '/course/collab-comm/coaching' },
  },
  {
    week: 9, courseId: 'collab-comm', theme: '회의 운영과 AI 시대의 소통', provider: '실무 분야 전문가',
    lectures: [
      { id: 'L9-1', title: '아무도 말하지 않는 TBM 바꾸기 — 회의 운영', instructor: '회의 퍼실리테이터', duration: '13:20', summary: '리더만 말하는 회의를 모두가 위험을 말하는 회의로. 리더의 자기 개방과 질문 설계.', chapters: [{ at: '00:00', title: '침묵하는 회의의 신호' }, { at: '06:00', title: '"어제 아찔했던 순간 하나"' }], notes: ['리더가 먼저 자기 실수를 말하면 분위기가 바뀐다'] },
      { id: 'L9-2', title: 'AI에게만 묻는 신입, 사람이 사람을 돕는 법', instructor: 'HRD팀', duration: '15:00', summary: '질문을 피하고 AI에 의존하는 시대에 리더와 선배가 어떻게 도움이 될 수 있는지에 관한 방법론.', chapters: [{ at: '00:00', title: '왜 사람에게 묻지 않을까' }, { at: '05:40', title: '질문 필수 시간 만들기' }, { at: '10:30', title: '면담 전 정서적 질문' }], notes: ['AI는 사전 조사, 현장 판단은 사람에게 확인', '"요즘 제일 버거운 게 뭐예요?"로 면담을 연다'] },
    ],
    check: { lessonId: 'cc-c', label: '1:1 펄스 면담 질문 카드', desc: '팀원 한 명을 골라 정서적 질문 카드를 면담 준비 노트에 담습니다.', path: '/course/collab-comm/pulse' },
  },
  {
    week: 10, courseId: 'collab-comm', theme: '부서 간 협업과 이해관계 조율', provider: '협업 분야 전문가',
    lectures: [
      { id: 'L10-1', title: 'AI 요약본만 오가는 부서 사이', instructor: '조직개발 전문가', duration: '14:40', summary: '본사 스마트안전팀은 로그 요약본만 보고, 현장은 현장을 모르는 지시라 느낍니다. 서로 모르는 제약을 꺼내는 대화.', chapters: [{ at: '00:00', title: '부서 이기주의는 정보의 단절' }, { at: '07:10', title: '15분 교환 인터뷰' }], notes: ['상대 부서가 모르는 제약 하나씩 꺼내기'] },
      { id: 'L10-2', title: '작은 절차 하나에 합의하기', instructor: '조직개발 전문가', duration: '10:05', summary: '"로그 공문 발송 전 현장 확인 1회"처럼 함께 바꿀 수 있는 가장 작은 절차와 확인 방법을 정합니다.', chapters: [{ at: '00:00', title: '큰 합의보다 작은 절차' }, { at: '05:00', title: '협업 합의서 쓰기' }], notes: ['합의는 확인 방법·시점까지 정해야 지켜진다'] },
    ],
    check: { lessonId: 'cc-f', label: '브릿지 매칭 · 협업 합의서', desc: '타 부서 리더 한 명과 공동 과제 하나를 합의서로 남깁니다.', path: '/bridge?tab=matching' },
  },
  {
    week: 11, courseId: 'coaching', theme: '코칭의 기본 — 질문으로 이끌기', provider: '한국코치협회 연계 교육',
    lectures: [
      { id: 'L11-1', title: '코칭이란 무엇인가 — 길을 대신 정하지 않는 리더', instructor: '한국코치협회 인증 코치', duration: '18:00', summary: '이끈다는 것은 가야 할 길을 대신 정해 주는 것이 아니라, 팀원이 스스로 길을 찾도록 질문하는 것입니다.', chapters: [{ at: '00:00', title: '지시와 코칭의 차이' }, { at: '07:00', title: '열린 질문, 닫힌 질문' }, { at: '13:20', title: '답을 정해 주고 싶은 순간' }], notes: ['질문으로 끝나는가 · 열린 질문인가 · 답을 정해 주지 않았는가'] },
      { id: 'L11-2', title: '판단 위임 — 팀원이 자기 판단 영역을 찾게 하기', instructor: '한국코치협회 인증 코치', duration: '14:25', summary: '"이 결정은 현장에서 누가 내려야 할까요?" 팀원이 AI에게 맡길 일과 자신이 판단할 일을 직접 나누게 돕습니다.', chapters: [{ at: '00:00', title: 'AI를 위협이 아닌 도구로' }, { at: '06:30', title: '팀원이 쓰는 기준표' }], notes: ['기준표는 리더가 써서 건네지 않는다', '리더는 방향과 원칙, 팀원은 판단 영역'] },
    ],
    check: { lessonId: 'co-a', label: '코칭 면담', desc: '질문 → 팀원 기준표 → 첫 계획까지 한 번의 면담을 완료합니다.', path: '/course/coaching/session' },
  },
  {
    week: 12, courseId: 'coaching', theme: '성장을 기록하고 피드백하기 · 수료', provider: '한국코치협회 연계 교육',
    lectures: [
      { id: 'L12-1', title: '면담이 말로 끝나지 않게 — 단계별 성장 기록', instructor: '한국코치협회 인증 코치', duration: '15:35', summary: '문제를 처음 인식한 때부터 해결책을 찾고 고쳐 나간 과정을 기록하고, 결과가 아니라 과정에 피드백합니다.', chapters: [{ at: '00:00', title: '결과 피드백 vs 과정 피드백' }, { at: '07:20', title: '동료·협력 부서 피드백으로 확인' }], notes: ['문제 정의 · 새로운 시도 · 오류 수정을 본다'] },
      { id: 'L12-2', title: '코치 인증과 리더 수료 안내', instructor: 'HRD팀 · 한국코치협회', duration: '08:45', summary: '한국코치협회 인증 취득 시 CC 수료 가산점. 인증(자격)과 현장 코칭(실행)을 구분하는 이유와 수료 절차.', chapters: [{ at: '00:00', title: '인증 제도 안내' }, { at: '04:30', title: '사후 진단과 리더 직급' }], notes: ['캡틴에서 리더로'] },
    ],
    check: { lessonId: 'co-b', label: '단계별 성장 기록', desc: '팀원의 계획에 단계 기록과 과정 피드백을 남깁니다.', path: '/course/coaching/growth' },
  },
  {
    week: 13, courseId: 'charisma-character', theme: '리더로서 계속 성장하기', provider: 'HRD팀',
    lectures: [
      { id: 'L13-1', title: '수료 후에도 CC를 쓰는 법', instructor: 'HRD팀', duration: '09:10', summary: '고민이 생기면 리더 AI에게, 난처할 땐 P난처에. 내 경험을 솔루션으로 남겨 다음 캡틴을 돕습니다.', chapters: [{ at: '00:00', title: '리더 AI와 P난처' }, { at: '04:40', title: '동료 코칭 서클' }], notes: ['리더가 된 뒤에는 솔루션을 쓰는 사람이 된다'] },
    ],
    check: { label: 'P난처에 내 경험 남기기', desc: '솔루션 기다리는 상황에 리더로서 답을 남깁니다.', path: '/pnancheo' },
  },
]

export const weekLecturesFor = (week: number) => weekLectures.find((w) => w.week === Math.min(13, Math.max(0, week)))!
export const allLectures = weekLectures.flatMap((w) => w.lectures.map((l, i) => ({ ...l, week: w.week, courseId: w.courseId, index: i })))
export const lectureById = (id: string) => allLectures.find((l) => l.id === id)

export const toSeconds = (d: string) => {
  const [m, s] = d.split(':').map(Number)
  return m * 60 + s
}
export const fmtTime = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`
export const totalMinutes = (ls: Lecture[]) => Math.round(ls.reduce((a, l) => a + toSeconds(l.duration), 0) / 60)
