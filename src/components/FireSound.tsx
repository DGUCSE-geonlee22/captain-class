import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * 모닥불 장작 타는 소리 (P난처 배경음).
 * 외부 음원 파일 없이 Web Audio로 합성한다: 낮게 깔리는 불길 소리 + 불규칙하게 튀는 탁탁 소리.
 * 브라우저 정책상 사용자가 눌러야 소리가 나므로 기본은 꺼짐.
 */
export default function FireSound({ className = '' }: { className?: string }) {
  const [on, setOn] = useState(false)
  const engine = useRef<FireEngine | null>(null)

  useEffect(() => () => engine.current?.stop(), [])

  const toggle = () => {
    if (on) {
      engine.current?.stop()
      engine.current = null
      setOn(false)
      return
    }
    engine.current = startFire()
    setOn(true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] transition-colors ${on ? 'border-ember-400/60 text-ember-300' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'} ${className}`}
    >
      {on ? <Volume2 size={12} /> : <VolumeX size={12} />}
      {on ? '장작 소리 끄기' : '장작 소리 켜기'}
    </button>
  )
}

interface FireEngine {
  stop: () => void
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

function startFire(): FireEngine {
  const ctx = new AudioContext()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2)

  // 1) 낮게 깔리는 불길 소리: 노이즈를 저역만 남기고, 볼륨을 천천히 흔든다
  const base = ctx.createBufferSource()
  base.buffer = noiseBuffer(ctx, 4)
  base.loop = true
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 320
  lowpass.Q.value = 0.7
  const baseGain = ctx.createGain()
  baseGain.gain.value = 0.22
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.35
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.08
  lfo.connect(lfoGain)
  lfoGain.connect(baseGain.gain)
  base.connect(lowpass)
  lowpass.connect(baseGain)
  baseGain.connect(master)
  base.start()
  lfo.start()

  // 2) 탁탁 튀는 소리: 짧은 노이즈 조각을 불규칙한 간격으로 재생
  const crackle = noiseBuffer(ctx, 0.12)
  let timer = 0
  const pop = () => {
    const src = ctx.createBufferSource()
    src.buffer = crackle
    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 1500 + Math.random() * 3500
    bandpass.Q.value = 1.2
    const g = ctx.createGain()
    const t = ctx.currentTime
    const peak = 0.15 + Math.random() * 0.35
    const dur = 0.02 + Math.random() * 0.07
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(peak, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(bandpass)
    bandpass.connect(g)
    g.connect(master)
    src.start(t)
    src.stop(t + dur + 0.01)
    timer = window.setTimeout(pop, 40 + Math.random() * 420)
  }
  pop()

  return {
    stop: () => {
      window.clearTimeout(timer)
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 0.4)
      window.setTimeout(() => {
        base.stop()
        lfo.stop()
        void ctx.close()
      }, 500)
    },
  }
}
