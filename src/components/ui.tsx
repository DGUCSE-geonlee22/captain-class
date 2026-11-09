import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronLeft, Info, ShieldAlert } from 'lucide-react'
import { axisMeta } from '../data/courses'
import type { Axis } from '../data/types'

/** 스크롤 진입 시 등장 (참고 사이트의 js-inview) */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'li' | 'article'; delay?: number }) {
  const ref = useRef<HTMLElement | null>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const Comp = Tag as 'div'
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${on ? 'is-inview' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Comp>
  )
}

/** 참고 사이트식 섹션 제목: 영문 콘덴스드 + 포인트 밑줄 + 한국어 부제 */
export function SectionHead({ en, ko, sub, tone = 'light', align = 'center', ruleColor }: { en: string; ko?: ReactNode; sub?: ReactNode; tone?: 'light' | 'dark' | 'ember'; align?: 'center' | 'left'; ruleColor?: string }) {
  const enCls = tone === 'light' ? 'text-navy-800' : tone === 'ember' ? 'text-ember-300' : 'text-white'
  const koCls = tone === 'light' ? 'text-navy-700' : tone === 'ember' ? 'text-white/90' : 'text-white/90'
  const subCls = tone === 'light' ? 'text-slate-600' : 'text-white/60'
  const rule = ruleColor ?? (tone === 'light' ? '#1E2A4A' : tone === 'ember' ? '#ff8a1f' : '#ffffff')
  return (
    <Reveal className={align === 'center' ? 'text-center' : 'text-left'}>
      <h2 className={`sec-en ${enCls}`}>{en}</h2>
      <div className={`reveal-rule h-[3px] ${align === 'center' ? 'mx-auto' : ''} mt-3`} style={{ background: rule }} />
      {ko && <p className={`sec-ko ${koCls}`}>{ko}</p>}
      {sub && <p className={`mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed ${subCls}`}>{sub}</p>}
    </Reveal>
  )
}

/** 모든 AI 목업 결과물에 붙이는 표시 */
export function AiNotice({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`badge ${dark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'} ${className}`}>
      <Info size={12} /> 참고용 · 최종 판단은 리더가
    </span>
  )
}

/** 입력창 근처에 두는 개인정보 경고 */
export function PrivacyWarning({ text = '실명·연락처·고객정보 등 개인 식별 정보는 입력하지 마세요.', dark = false }: { text?: string; dark?: boolean }) {
  return (
    <p className={`mt-1.5 flex items-center gap-1.5 text-xs ${dark ? 'text-ember-300/80' : 'text-safety-700'}`}>
      <ShieldAlert size={13} /> {text}
    </p>
  )
}

/** 내부 페이지 제목 (참고 사이트식 중앙 정렬 영문 + 한국어) */
export function PageHeader({
  en,
  eyebrow,
  title,
  description,
  backTo,
  backLabel,
  right,
}: {
  en?: string
  eyebrow?: ReactNode
  title: string
  description?: ReactNode
  backTo?: string
  backLabel?: string
  right?: ReactNode
}) {
  return (
    <div className="relative mb-10 pt-2">
      {(backTo || right) && (
        <div className="mb-4 flex items-center justify-between">
          {backTo ? (
            <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy-700">
              <ChevronLeft size={16} /> {backLabel ?? '뒤로'}
            </Link>
          ) : (
            <span />
          )}
          {right}
        </div>
      )}
      <div className="text-center">
        {en && (
          <>
            <p className="font-display text-[34px] uppercase leading-none tracking-[0.04em] text-navy-800">{en}</p>
            <div className="sec-rule" />
          </>
        )}
        {eyebrow && <div className="mt-4 flex items-center justify-center gap-2">{eyebrow}</div>}
        <h1 className={`${en ? 'mt-4 text-[24px] font-medium text-navy-700' : 'text-2xl font-bold text-navy-800'} tracking-[0.01em]`}>{title}</h1>
        {description && <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
    </div>
  )
}

export function AxisBadge({ axis }: { axis: Axis }) {
  const m = axisMeta[axis]
  return (
    <span className={`badge ${m.bg} ${m.text}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} /> {m.label}
    </span>
  )
}

export function ProgressBar({ value, color = '#1F9E8F', height = 8, track = 'bg-slate-100' }: { value: number; color?: string; height?: number; track?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full ${track}`} style={{ height }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  )
}

export function EmptyState({ icon, title, desc, action }: { icon?: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-3 text-slate-300">{icon}</div>}
      <p className="font-semibold text-slate-700">{title}</p>
      {desc && <p className="mt-1 max-w-md text-sm text-slate-500">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Callout({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'teal' | 'dark'; children: ReactNode }) {
  const cls =
    tone === 'warn'
      ? 'bg-safety-50 border-safety-200 text-safety-700'
      : tone === 'teal'
        ? 'bg-teal-50 border-teal-200 text-teal-700'
        : tone === 'dark'
          ? 'bg-white/5 border-white/10 text-white/75'
          : 'bg-navy-50 border-navy-100 text-navy-700'
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${cls}`}>
      {tone === 'warn' ? <AlertTriangle size={16} className="mt-0.5 shrink-0" /> : <Info size={16} className="mt-0.5 shrink-0" />}
      <div>{children}</div>
    </div>
  )
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  )
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-navy-800">{children}</h2>
      {right}
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, dark = false }: { tabs: { id: T; label: string }[]; value: T; onChange: (v: T) => void; dark?: boolean }) {
  return (
    <div className={`mb-6 flex gap-1 rounded-xl p-1 ${dark ? 'bg-white/5' : 'bg-slate-200/60'}`}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            value === t.id ? (dark ? 'bg-ember-500/20 text-ember-300' : 'bg-white text-navy-800 shadow-sm') : dark ? 'text-white/50 hover:text-white/80' : 'text-slate-500 hover:text-navy-700'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
