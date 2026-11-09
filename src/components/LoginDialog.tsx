import { useState } from 'react'
import { Anchor, Award, Cloud, CloudOff, LogIn, Settings2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ApiError } from '../lib/api'

/** 데모 계정 (서버 시드와 동일, PIN 0000) */
const demoAccounts = [
  { name: '이하영', label: '이하영 · 신임 공사 A파트장 (캡틴)', role: 'captain' as const },
  { name: '정소장', label: '정○○ 소장 · B현장 (리더)', role: 'leader' as const },
  { name: '윤팀장', label: '윤○○ 팀장 · 본사 스마트안전팀 (리더)', role: 'leader' as const },
  { name: '한팀장', label: '한○○ 팀장 · 본사 공무팀 (리더)', role: 'leader' as const },
]

export default function LoginDialog({ onClose }: { onClose: () => void }) {
  const { auth } = useApp()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [url, setUrl] = useState(auth.apiBase)

  const submit = async (n = name, p = pin) => {
    setError(null)
    if (n.trim().length < 2) return setError('이름을 2자 이상 입력하세요.')
    if (!/^\d{4}$/.test(p)) return setError('PIN은 숫자 4자리입니다.')
    setBusy(true)
    try {
      const r = await auth.login(n.trim(), p)
      onClose()
      if (r.created) alert(`'${n.trim()}' 계정을 새로 만들었습니다. 이 PIN을 기억해 두세요. 지금까지의 로컬 기록은 계정에 저장됐습니다.`)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '서버에 연결할 수 없습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/50 p-6" onClick={onClose}>
      <div className="card w-[560px] p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-teal-600">Sign in</p>
            <h2 className="mt-1 text-xl font-bold text-navy-800">CC 계정으로 로그인</h2>
            <p className="mt-1 text-sm text-slate-500">이름과 숫자 4자리 PIN을 쓰면 됩니다. 처음 쓰는 이름이면 계정이 새로 만들어지고, 기록이 서버에 저장되어 어디서든 이어집니다.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${auth.online ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>
          {auth.online ? <Cloud size={14} /> : <CloudOff size={14} />}
          {auth.online ? `서버 연결됨 · 사용자 ${auth.serverInfo?.users ?? 0}명 · 사례 ${auth.serverInfo?.cases ?? 0}건 · 고충 ${auth.serverInfo?.grievances ?? 0}건` : '서버에 연결되지 않았습니다. 로컬 모드에서는 기록이 이 브라우저에만 저장됩니다.'}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="label">이름</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 홍길동" className="input mt-1" maxLength={20} />
          </div>
          <div>
            <label className="label">PIN (숫자 4자리)</label>
            <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="0000" inputMode="numeric" className="input mt-1 tracking-[0.4em]" />
          </div>
        </div>
        {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button onClick={() => submit()} disabled={busy || !auth.online} className="btn-teal"><LogIn size={16} /> {busy ? '로그인 중…' : '로그인 / 가입'}</button>
        </div>

        <div className="mt-6">
          <p className="label">데모 계정 (PIN 0000)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {demoAccounts.map((a) => (
              <button key={a.name} disabled={busy || !auth.online} onClick={() => submit(a.name, '0000')} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-teal-300 hover:bg-teal-50/40 disabled:opacity-40">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${a.role === 'leader' ? 'bg-safety-500' : 'bg-navy-600'}`}>{a.role === 'leader' ? <Award size={13} /> : <Anchor size={13} />}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setShowAdvanced((v) => !v)} className="mt-5 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><Settings2 size={12} /> 서버 주소 설정</button>
        {showAdvanced && (
          <div className="mt-2 flex gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="비우면 같은 주소의 /api 사용 · 예: https://captain-class.onrender.com" className="input text-xs" />
            <button onClick={() => auth.setApiBase(url)} className="btn-ghost shrink-0 text-xs">적용·재연결</button>
          </div>
        )}
      </div>
    </div>
  )
}
