import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { PageHeader, Tabs } from '../../components/ui'
import { quizCategories, quizQuestions } from '../../data/quiz'
import type { QuizQuestion } from '../../data/types'
import { useApp } from '../../context/AppContext'

type Cat = QuizQuestion['category']

export default function QuizPage() {
  const { state, markQuizDone, completeLesson } = useApp()
  const [cat, setCat] = useState<Cat>('listening')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const questions = useMemo(() => quizQuestions.filter((q) => q.category === cat), [cat])
  const answered = questions.filter((q) => answers[q.id] !== undefined).length
  const correct = questions.filter((q) => answers[q.id] === q.answer).length
  const finished = answered === questions.length

  const select = (q: QuizQuestion, idx: number) => {
    if (answers[q.id] !== undefined) return
    const next = { ...answers, [q.id]: idx }
    setAnswers(next)
    if (questions.every((x) => next[x.id] !== undefined)) {
      markQuizDone(cat)
      completeLesson('cc-b')
    }
  }

  const reset = () => {
    const next = { ...answers }
    questions.forEach((q) => delete next[q.id])
    setAnswers(next)
  }

  return (
    <div>
      <PageHeader
        en="Quick Test"
        backTo="/course/collab-comm"
        backLabel="Collaboration+Communication 코스"
        eyebrow={<span className="badge bg-teal-50 text-teal-700">레슨 B</span>}
        title="소프트 스킬·실무 퀵 테스트"
        description="경청, 회의 운영, 피드백 각 3문항. 정답보다 해설이 중요합니다. 어떤 기준으로 그 대응이 더 나은지 읽어 보세요."
      />
      <Tabs tabs={quizCategories.map((c) => ({ id: c.id, label: `${c.label}${state.quizDone.includes(c.id) ? ' ✓' : ''}` }))} value={cat} onChange={setCat} />
      <p className="mb-4 -mt-3 text-sm text-slate-500">{quizCategories.find((c) => c.id === cat)?.desc}</p>

      <div className="space-y-4">
        {questions.map((q, qi) => {
          const chosen = answers[q.id]
          return (
            <div key={q.id} className="card p-6">
              <p className="label">문항 {qi + 1}</p>
              <p className="mt-1 font-bold text-navy-800">{q.prompt}</p>
              {q.passage && <blockquote className="mt-3 rounded-xl border-l-4 border-teal-300 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">{q.passage}</blockquote>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => {
                  const isChosen = chosen === i
                  const isAnswer = q.answer === i
                  let cls = 'border-slate-200 bg-white hover:border-slate-300'
                  if (chosen !== undefined) {
                    if (isAnswer) cls = 'border-teal-400 bg-teal-50'
                    else if (isChosen) cls = 'border-red-300 bg-red-50'
                    else cls = 'border-slate-100 bg-slate-50 text-slate-400'
                  }
                  return (
                    <button key={i} onClick={() => select(q, i)} disabled={chosen !== undefined} className={`flex items-start gap-2 rounded-xl border p-3.5 text-left text-sm transition ${cls}`}>
                      {chosen !== undefined && isAnswer && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" />}
                      {chosen !== undefined && isChosen && !isAnswer && <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />}
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>
              {chosen !== undefined && (
                <div className="mt-4 rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-800">
                  <span className="font-bold">해설 · </span>{q.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {finished && (
        <div className="card mt-6 flex items-center justify-between p-6">
          <div>
            <p className="text-lg font-bold text-navy-800">{correct} / {questions.length} 정답</p>
            <p className="text-sm text-slate-500">퀵 테스트 완료. 마일리지 5 M이 지급되었습니다.</p>
          </div>
          <button onClick={reset} className="btn-ghost"><RotateCcw size={16} /> 다시 풀기</button>
        </div>
      )}
    </div>
  )
}
