import { Award, Anchor, Coins, Gift, Lock } from 'lucide-react'
import { Callout, PageHeader, ProgressBar } from '../components/ui'
import { formatDate, useApp } from '../context/AppContext'
import { rewardPlaceholder } from '../data/classes'
import { TOTAL_WEEKS } from '../data/journey'

export default function CompletionPage() {
  const { state, totalMileage, isLeader, progress, profile } = useApp()
  const week = state.demoWeek

  return (
    <div>
      <PageHeader en="Completion" eyebrow={<span className="badge bg-safety-50 text-safety-700">수료 · 리워드</span>} title="캡틴에서 리더로" description="12주 항해를 마치고 사후 진단을 통과하면 '리더' 직급 배지가 부여됩니다." />

      <div className="grid grid-cols-5 gap-6">
        <section className="col-span-3">
          {isLeader ? (
            <div className="relative overflow-hidden rounded-3xl bg-navy-700 p-10 text-white">
              <div className="relative z-10 flex items-center gap-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-safety-500 shadow-xl ring-8 ring-safety-500/30"><Award size={64} /></div>
                <div>
                  <p className="text-sm text-navy-200">CC · Captain Class 수료</p>
                  <h2 className="mt-1 text-3xl font-black">{profile.name} <span className="text-safety-400">리더</span></h2>
                  <p className="mt-2 text-navy-100">직책만 받은 캡틴에서 사람을 이끄는 리더로. 사후 진단 통과 · 360 피드백 완료.</p>
                  <div className="mt-4 flex gap-2 text-xs">
                    <span className="badge bg-white/15 text-white">공감 축 {progress.compassion}%</span>
                    <span className="badge bg-white/15 text-white">리더십 축 {progress.leadership}%</span>
                    <span className="badge bg-white/15 text-white">P난처 솔루션 작성 권한</span>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-safety-500/20 blur-3xl" />
            </div>
          ) : (
            <div className="card p-10">
              <div className="flex items-center gap-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-slate-300 text-slate-300"><Anchor size={56} /></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">리더 배지까지</p>
                  <h2 className="mt-1 text-3xl font-black text-navy-800">{Math.max(0, TOTAL_WEEKS - week)}주 남음</h2>
                  <p className="mt-2 text-sm text-slate-600">12주차 말 사후 진단 후 '리더' 직급이 부여됩니다. (데모: 헤더에서 13주차로 바꾸면 배지가 열립니다)</p>
                  <div className="mt-4"><ProgressBar value={(week / TOTAL_WEEKS) * 100} color="#F28C28" height={10} /></div>
                </div>
              </div>
            </div>
          )}

          <div className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-navy-800"><Gift size={16} className="text-safety-500" /> 포상 제도</p>
              <span className="badge bg-slate-100 text-slate-600"><Lock size={11} /> {rewardPlaceholder.title}</span>
            </div>
            <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              <p className="font-semibold text-slate-600">{rewardPlaceholder.title}</p>
              <p className="mt-1">{rewardPlaceholder.note}</p>
              <p className="mt-3 text-xs text-slate-400">담당자는 <code>src/data/classes.ts</code>의 <code>rewardPlaceholder</code>·<code>mileageRules</code>를 채웁니다.</p>
            </div>
          </div>
        </section>

        <aside className="col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-navy-800"><Coins size={16} className="text-safety-500" /> 마일리지</p>
              <span className="text-2xl font-black text-safety-600">{totalMileage.toLocaleString()} M</span>
            </div>
            <ul className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {state.mileage.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                  <span>
                    <span className="block font-semibold text-slate-800">{m.label}</span>
                    <span className="text-[11px] text-slate-400">{formatDate(m.createdAt)}</span>
                  </span>
                  <span className="font-bold text-safety-600">+{m.points}</span>
                </li>
              ))}
            </ul>
          </div>
          <Callout tone="info">마일리지는 활동 기록용 목업입니다. 실제 포상 연계는 리워드 체계 확정 후 반영됩니다.</Callout>
        </aside>
      </div>
    </div>
  )
}
