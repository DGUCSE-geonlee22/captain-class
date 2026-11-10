import { useEffect, useRef, useState } from 'react'
import { Captions, CheckCircle2, Maximize, Pause, Play, Settings, SkipForward, Volume2 } from 'lucide-react'
import { courseVisual, fmtTime, toSeconds, type Lecture } from '../data/lectures'
import type { CourseId } from '../data/types'

/** 강의 썸네일 (영상임을 알아볼 수 있게: 16:9, 재생 버튼, 재생 시간 배지) */
export function VideoThumb({ courseId, lecture, index, watched, className = '', size = 'md' }: { courseId: CourseId; lecture: Lecture; index: number; watched?: boolean; className?: string; size?: 'sm' | 'md' }) {
  const v = courseVisual[courseId]
  return (
    <div className={`group relative aspect-video overflow-hidden rounded-xl ${className}`} style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}>
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5), transparent 40%), repeating-linear-gradient(120deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 14px)' }} />
      <div className={`absolute ${size === 'sm' ? 'left-2 top-1.5' : 'left-3 top-2.5'}`}>
        <p className={`font-display uppercase tracking-[0.15em] ${size === 'sm' ? 'text-[8px]' : 'text-[10px]'}`} style={{ color: v.accent }}>{v.label}</p>
        {size === 'md' && <p className="mt-0.5 line-clamp-2 max-w-[85%] text-[13px] font-bold leading-snug text-white">{lecture.title}</p>}
      </div>
      <span className={`absolute flex items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-lg transition group-hover:scale-110 ${size === 'sm' ? 'bottom-1.5 left-2 h-6 w-6' : 'bottom-3 left-3 h-10 w-10'}`}>
        <Play size={size === 'sm' ? 11 : 17} fill="currentColor" className="ml-0.5" />
      </span>
      <span className={`absolute rounded bg-black/75 font-mono font-semibold text-white ${size === 'sm' ? 'bottom-1.5 right-1.5 px-1 text-[9px]' : 'bottom-2.5 right-2.5 px-1.5 py-0.5 text-[11px]'}`}>{lecture.duration}</span>
      {size === 'md' && <span className="absolute right-2.5 top-2.5 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white">{String(index + 1).padStart(2, '0')}강</span>}
      {watched && <div className="absolute inset-x-0 bottom-0 h-1 bg-safety-400" />}
      {watched && <CheckCircle2 size={size === 'sm' ? 14 : 18} className={`absolute text-safety-300 ${size === 'sm' ? 'right-1.5 top-1.5' : 'right-12 top-2.5'}`} />}
    </div>
  )
}

/**
 * 강의 플레이어 목업. 실제 영상은 없다.
 * 재생하면 시연용 빠른 재생(약 8초)으로 진행 막대가 차고, 끝나면 수강 완료가 된다.
 */
export function VideoPlayer({ courseId, lecture, index, watched, onComplete, onNext }: { courseId: CourseId; lecture: Lecture; index: number; watched: boolean; onComplete: () => void; onNext?: () => void }) {
  const v = courseVisual[courseId]
  const total = toSeconds(lecture.duration)
  const [t, setT] = useState(watched ? total : 0)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const doneRef = useRef(watched)
  const completeRef = useRef(onComplete)
  useEffect(() => {
    completeRef.current = onComplete
  })
  const speed = total / 8 // 약 8초에 끝나는 시연용 배속

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setT((x) => Math.min(total, x + speed / 10))
    }, 100)
    return () => window.clearInterval(id)
  }, [playing, total, speed])

  // 끝까지 재생되면 멈추고 수강 완료 처리 (렌더 중 상태 변경을 피하려고 effect에서 처리)
  useEffect(() => {
    if (!playing || t < total) return
    const id = window.setTimeout(() => {
      setPlaying(false)
      setEnded(true)
      if (!doneRef.current) {
        doneRef.current = true
        completeRef.current()
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [t, total, playing])

  const toggle = () => {
    if (ended || t >= total) {
      setT(0)
      setEnded(false)
    }
    setPlaying((p) => !p)
  }
  const seek = (sec: number) => {
    setT(sec)
    setEnded(false)
  }
  const pct = (t / total) * 100
  const chapterAt = [...lecture.chapters].reverse().find((c) => toSeconds(c.at) <= t) ?? lecture.chapters[0]

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* 화면 */}
      <div className="relative aspect-video cursor-pointer select-none" onClick={toggle} style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.6), transparent 35%), repeating-linear-gradient(120deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 18px)' }} />
        {/* 강의 슬라이드 느낌 */}
        <div className="absolute inset-0 flex flex-col justify-center px-14">
          <p className="font-display text-sm uppercase tracking-[0.25em]" style={{ color: v.accent }}>{v.label} · {String(index + 1).padStart(2, '0')}강</p>
          <p className="mt-3 max-w-3xl text-[32px] font-black leading-tight text-white">{lecture.title}</p>
          <p className="mt-4 text-sm text-white/70">{lecture.instructor}</p>
          {(playing || t > 0) && !ended && <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs text-white/90">▶ {chapterAt.title}</p>}
        </div>
        {/* 재생 버튼 */}
        {!playing && !ended && (
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-2xl transition hover:scale-110">
            <Play size={34} fill="currentColor" className="ml-1" />
          </span>
        )}
        {/* 재생 중 표시 */}
        {playing && (
          <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> 재생 중 · 시연용 빠른 재생
          </span>
        )}
        {/* 종료 오버레이 */}
        {ended && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white" onClick={(e) => e.stopPropagation()}>
            <CheckCircle2 size={44} className="text-safety-300" />
            <p className="mt-2 text-lg font-bold">수강 완료</p>
            <div className="mt-4 flex gap-2">
              <button onClick={toggle} className="btn border border-white/30 text-white hover:bg-white/10">다시 보기</button>
              {onNext && <button onClick={onNext} className="btn-orange"><SkipForward size={16} /> 다음 강의</button>}
            </div>
          </div>
        )}
      </div>
      {/* 컨트롤 바 */}
      <div className="bg-[#0f0f0f] px-4 pb-3 pt-2 text-white">
        <div className="relative h-5 cursor-pointer" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * total) }}>
          <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-white/20" />
          <div className="absolute left-0 top-2 h-1 rounded-full bg-red-600" style={{ width: `${pct}%` }} />
          {lecture.chapters.slice(1).map((c) => <span key={c.at} className="absolute top-2 h-1 w-0.5 bg-black" style={{ left: `${(toSeconds(c.at) / total) * 100}%` }} />)}
          <span className="absolute top-[3px] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-red-600" style={{ left: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={toggle} aria-label={playing ? '일시정지' : '재생'}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
          {onNext && <button onClick={onNext} aria-label="다음 강의"><SkipForward size={18} /></button>}
          <Volume2 size={18} className="opacity-80" />
          <span className="font-mono text-xs text-white/80">{fmtTime(t)} / {lecture.duration}</span>
          <span className="truncate text-xs text-white/50">· {chapterAt.title}</span>
          <span className="ml-auto flex items-center gap-4 opacity-80">
            <Captions size={18} />
            <span className="text-xs">1.0x</span>
            <Settings size={18} />
            <Maximize size={18} />
          </span>
        </div>
      </div>
    </div>
  )
}
