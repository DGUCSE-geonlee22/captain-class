import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Swords } from 'lucide-react'
import { PageHeader } from '../../components/ui'
import { LeaderCard, LeaderDetail } from '../../components/LeaderCard'
import { categoryMeta, leaderById, leaders, type LeaderCategory } from '../../data/leaders'
import { useApp } from '../../context/AppContext'

export default function LeadersPage() {
  const [params, setParams] = useSearchParams()
  const { completeLesson } = useApp()
  const [filter, setFilter] = useState<'all' | LeaderCategory>('all')
  const selected = leaderById(params.get('leader') ?? '') ?? leaders[0]
  const list = useMemo(() => (filter === 'all' ? leaders : leaders.filter((l) => l.category === filter)), [filter])

  const pick = (id: string) => {
    setParams({ leader: id })
    completeLesson('ch-a')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <PageHeader
        en="Leader Cards"
        backTo="/course/charisma-character"
        backLabel="Charisma+Character 코스"
        eyebrow={<span className="badge bg-navy-50 text-navy-700">레슨 A</span>}
        title="리더 카드 도감 — 역사·스포츠·콘텐츠 속 리더의 카리스마와 품격"
        description="모두 훌륭한 리더이지만 인물마다 지향하는 가치관이 다릅니다. 여러 리더의 성격과 리더십을 살펴보며 내 상황에 맞는 리더십을 찾아보세요. 마음에 드는 리더에게는 바로 고민을 물어볼 수 있습니다."
        right={<Link to={`/course/charisma-character/leader-ai?leader=${selected.id}`} className="btn-orange"><Swords size={16} /> {selected.name}에게 고민 묻기</Link>}
      />
      <LeaderDetail leader={selected} />
      <div className="mt-10 flex items-center justify-between">
        <p className="text-lg font-bold text-navy-800">전체 리더 {leaders.length}명</p>
        <div className="flex gap-1.5">
          {(['all', 'history', 'sports', 'story'] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === c ? 'bg-navy-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:bg-slate-50'}`}>
              {c === 'all' ? '전체' : categoryMeta[c].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-5">
        {list.map((l) => (
          <div key={l.id} className="flex justify-center"><LeaderCard leader={l} selected={l.id === selected.id} onClick={() => pick(l.id)} /></div>
        ))}
      </div>
    </div>
  )
}
