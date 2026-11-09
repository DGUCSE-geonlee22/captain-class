import { CurriculumTable, WeekStrip } from '../components/Curriculum'
import { Callout, PageHeader, Reveal } from '../components/ui'
import { useApp } from '../context/AppContext'
import { stageForWeek, weekPlanFor } from '../data/journey'

export default function CurriculumPage() {
  const { state } = useApp()
  const stage = stageForWeek(state.demoWeek)
  const plan = weekPlanFor(state.demoWeek)
  return (
    <div>
      <PageHeader
        en="Curriculum"
        title="12주 주차별 수강 코스"
        description="진단(0주) → Read(1~3주, Compassion) → Evaluate(4~6주, Charisma+Character) → Act(7~9주, Collaboration+Communication) → Link(10~12주, 브릿지 매칭 + Coaching) → 수료 → 유지(13주+). 매주 수업 1개와 현업 미션 1개가 짝을 이룹니다."
      />
      <Reveal><WeekStrip /></Reveal>
      <Reveal className="mt-6" delay={80}>
        <Callout tone="info">
          <b>지금 {state.demoWeek === 0 ? '진단' : state.demoWeek >= 13 ? '13주+' : `${state.demoWeek}주차`} · {stage.name} 단계</b> — 이번 주 수업은 <b>{plan.title}</b>({plan.courseLabel})이고, 현업 미션은 "{plan.mission}"입니다. 헤더의 데모 주차를 바꾸거나 위 눈금을 누르면 표가 따라 바뀝니다.
        </Callout>
      </Reveal>
      <Reveal className="mt-6" delay={160}><CurriculumTable /></Reveal>
      <Reveal className="mt-8 grid grid-cols-3 gap-4 text-sm" delay={240}>
        <div className="card p-5">
          <p className="font-bold text-navy-800">수업 → 미션 → 기록</p>
          <p className="mt-1 text-slate-600">각 주의 수업(포털)에서 배운 것을 그 주 현장에서 1회 적용하고 '내 기록'에 남깁니다. 기록이 쌓여야 2축 진척도가 오릅니다.</p>
        </div>
        <div className="card p-5">
          <p className="font-bold text-navy-800">준비 중 표시</p>
          <p className="mt-1 text-slate-600">Charisma+Character(4~6주)와 Coaching(11주)은 확정된 한 줄 설명만 적혀 있습니다. 담당 장한이 님이 <code>src/data/journey.ts</code>의 topics를 채웁니다.</p>
        </div>
        <div className="card p-5">
          <p className="font-bold text-navy-800">Construction 배치</p>
          <p className="mt-1 text-slate-600">기초 역량 코스의 배치 주차는 미정(TBD)입니다. 담당 주우상 님이 확정하면 표 위쪽 주차에 삽입됩니다.</p>
        </div>
      </Reveal>
    </div>
  )
}
