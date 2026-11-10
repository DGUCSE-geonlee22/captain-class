import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, MessageCircleQuestion, Save } from 'lucide-react'
import { AiNotice, Callout, PageHeader, Toast } from '../../components/ui'
import { checkCoachingQuestion, coachingCheckLabels, coachingPrinciple, coachingTopics } from '../../data/coaching'
import { teamMembers } from '../../data/team'
import { useApp } from '../../context/AppContext'

export default function CoachingQuestionsPage() {
  const { addCoachingNote, completeLesson } = useApp()
  const [topicId, setTopicId] = useState(coachingTopics[0].id)
  const topic = coachingTopics.find((t) => t.id === topicId)!
  const member = teamMembers.find((m) => m.id === topic.memberId)!
  const [qs, setQs] = useState(['', '', ''])
  const [toast, setToast] = useState<string | null>(null)

  const checks = useMemo(() => qs.map((q) => (q.trim() ? checkCoachingQuestion(q) : null)), [qs])
  const score = checks.reduce((a, c) => a + (c ? [c.isQuestion, c.isOpen, c.noAnswerGiven].filter(Boolean).length : 0), 0)
  const filled = qs.filter((q) => q.trim().length >= 5).length

  const save = () => {
    addCoachingNote({ memberId: member.id, memberName: member.name, topic: topic.topic, questions: qs.filter((q) => q.trim()), score })
    completeLesson('co-a')
    setToast('코칭 노트에 저장했습니다 (+10 M)')
    setTimeout(() => setToast(null), 2200)
    setQs(['', '', ''])
  }

  return (
    <div>
      <PageHeader
        en="Coaching Questions"
        backTo="/course/coaching"
        backLabel="Coaching 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 A</span>}
        title="코칭 질문 연습 — 길을 정해 주지 않고 묻기"
        description={coachingPrinciple.body}
        right={<AiNotice />}
      />
      <div className="grid grid-cols-5 gap-6">
        <aside className="col-span-2 space-y-2">
          <p className="label mb-2">면담 주제</p>
          {coachingTopics.map((t) => {
            const m = teamMembers.find((x) => x.id === t.memberId)!
            return (
              <button key={t.id} onClick={() => { setTopicId(t.id); setQs(['', '', '']) }} className={`w-full rounded-xl border p-3 text-left transition ${t.id === topicId ? 'border-navy-400 bg-navy-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className="block text-sm font-bold text-navy-800">{m.name}</span>
                <span className="block text-xs text-slate-600">{t.topic}</span>
              </button>
            )
          })}
        </aside>
        <section className="col-span-3 space-y-4">
          <div className="card p-6">
            <p className="text-xs text-slate-500">{member.role} · {member.situation}</p>
            <h3 className="mt-1 text-lg font-bold text-navy-800">{topic.topic}</h3>
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <b>길을 대신 정해 주는 말 · </b>{topic.tellingExample}
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-800"><MessageCircleQuestion size={16} className="text-navy-500" /> 대신, 팀원이 스스로 길을 찾게 하는 질문 3개를 적어 보세요</p>
            {topic.exampleQuestions && (
              <details className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                <summary className="cursor-pointer font-semibold text-slate-700">막히면 열어 보기 · 문서의 질문 예시 (따라 쓰지 말고 내 말로)</summary>
                <ul className="mt-2 space-y-1">{topic.exampleQuestions.map((q) => <li key={q}>" {q}</li>)}</ul>
              </details>
            )}
            <div className="mt-3 space-y-3">
              {qs.map((q, i) => {
                const c = checks[i]
                return (
                  <div key={i}>
                    <input value={q} onChange={(e) => setQs(qs.map((x, j) => (j === i ? e.target.value : x)))} placeholder={i === 0 ? '예: 지연이 생기는 구간에서 두현 씨가 보기에 제일 먼저 풀어야 할 매듭은 뭐예요?' : `질문 ${i + 1}`} className="input" />
                    {c && (
                      <div className="mt-1.5 flex gap-3 text-[11px]">
                        {coachingCheckLabels.map((l) => (
                          <span key={l.key} className={`flex items-center gap-1 ${c[l.key] ? 'text-teal-600' : 'text-slate-400'}`} title={l.hint}>{c[l.key] ? <CheckCircle2 size={11} /> : <Circle size={11} />} {l.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-600">점검 {score} / 9</span>
              <div className="flex gap-2">
                <Link to="/records?tab=coaching" className="btn-ghost">내 코칭 노트</Link>
                <button onClick={save} disabled={filled < 3} className="btn-primary"><Save size={16} /> 코칭 노트로 저장</button>
              </div>
            </div>
          </div>
          <Callout tone="info">Charisma+Character 코스가 리더에게 질문을 던지는 구조였다면, Coaching은 리더가 팀원에게 질문하며 방향을 제시하는 구조입니다. 점검은 규칙 기반 참고용이고, 실제 면담에서는 1:1 펄스 면담 질문 카드와 함께 쓰세요.</Callout>
        </section>
      </div>
      <Toast message={toast} />
    </div>
  )
}
