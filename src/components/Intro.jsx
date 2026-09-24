import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'

const STORY = [
  'Long ago, before the era of cloud computing…',
  'in a land troubled by failing networks and restless servers,',
  'a lone Full Stack Developer set out to build & keep the systems alive—',
  'one ticket and one commit at a time.',
]

export default function Intro({ onFinish }) {
  const { musicOn, startMusic } = useApp()
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('story')
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onFinish()
      return
    }
  }, [onFinish])

  /* Lock page scroll while intro is shown (no right-side scrollbar) */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  /* Start music on the first user interaction (autoplay policy) */
  const startMusicIfNeeded = useCallback(() => {
    if (!musicOn) startMusic()
  }, [musicOn, startMusic])

  useEffect(() => {
    const start = () => startMusicIfNeeded()
    window.addEventListener('pointerdown', start)
    return () => window.removeEventListener('pointerdown', start)
  }, [startMusicIfNeeded])

  useEffect(() => {
    if (phase !== 'story') return
    if (step >= STORY.length) {
      setPhase('title')
      return
    }
    const t = setTimeout(() => {
      setFade(false)
      setTimeout(() => {
        setStep((s) => s + 1)
        setFade(true)
      }, 500)
    }, 3200)
    return () => clearTimeout(t)
  }, [step, phase])

  const handleSkip = useCallback(() => onFinish(), [onFinish])

  const advance = () => {
    if (phase === 'story') {
      setFade(false)
      setTimeout(() => {
        setStep((s) => s + 1)
        setFade(true)
      }, 300)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-700"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1b1b36 50%, #10102b 100%)' }}
    >
      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 bg-adventure-gold rounded-full animate-twinkle pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-[101] text-white/50 hover:text-white text-sm font-semibold transition-colors cursor-none"
      >
        Skip Intro →
      </button>

      {/* Story phase */}
      {phase === 'story' && step < STORY.length && (
        <div
          className={`text-center px-6 transition-all duration-500 cursor-pointer ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          onClick={advance}
        >
          <p className="font-body text-lg md:text-xl text-white/80 italic max-w-xl leading-relaxed">
            "{STORY[step]}"
          </p>
          <div className="flex gap-1.5 justify-center mt-6">
            {STORY.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-adventure-gold' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Title phase */}
      {phase === 'title' && (
        <div className="text-center px-6 animate-fade-in">
          <div className="mb-6 inline-block bg-adventure-purple/20 text-adventure-gold font-heading text-sm px-6 py-2 rounded-full border border-adventure-gold/20">
            ⚔️ FULL STACK QUEST
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
            Adventures in<br />
            <span className="text-gradient text-transparent bg-clip-text bg-gradient-to-r from-adventure-gold via-adventure-coral to-adventure-pink">
              Full Stack
            </span>
          </h1>
          <p className="text-white/50 text-sm md:text-base mb-10">
            A never-ending quest to build, integrate, and keep the systems running.
          </p>
          <button
            onClick={onFinish}
            className="bg-adventure-gold hover:bg-adventure-gold/90 text-adventure-dark font-heading text-base md:text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            BEGIN QUEST ▶
          </button>
          <p className="text-white/30 text-xs mt-4">or press ENTER</p>
        </div>
      )}

      {/* Enter key support */}
      <OnEnter onFinish={onFinish} phase={phase} />
    </div>
  )
}

function OnEnter({ onFinish, phase }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && phase === 'title') onFinish()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFinish, phase])
  return null
}