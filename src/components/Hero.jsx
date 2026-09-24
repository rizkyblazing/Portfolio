import { useEffect, useRef } from 'react'
import personalInfo from '../data/personalInfo'

function FloatingCloud({ className, delay = 0 }) {
  return (
    <div
      className={`absolute opacity-20 dark:opacity-10 pointer-events-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <svg viewBox="0 0 200 80" fill="white" className="w-full h-full">
        <ellipse cx="60" cy="50" rx="60" ry="30" />
        <ellipse cx="100" cy="40" rx="50" ry="35" />
        <ellipse cx="140" cy="50" rx="55" ry="28" />
        <ellipse cx="90" cy="55" rx="70" ry="25" />
      </svg>
    </div>
  )
}

function FloatingStar({ className, delay = 0 }) {
  return (
    <div
      className={`absolute w-2 h-2 bg-adventure-gold rounded-full animate-twinkle pointer-events-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20
      heroRef.current.style.setProperty('--parallax-x', `${x}px`)
      heroRef.current.style.setProperty('--parallax-y', `${y}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden
        bg-gradient-to-b from-adventure-sky via-[#a29bfe] to-adventure-light
        dark:from-[#0a0a1a] dark:via-night-bgAlt dark:to-night-bg"
    >
      {/* Floating clouds */}
      <FloatingCloud className="w-40 h-16 top-[10%] left-[5%] animate-float" delay={0} />
      <FloatingCloud className="w-32 h-12 top-[15%] right-[10%] animate-float-slow" delay={1} />
      <FloatingCloud className="w-48 h-16 top-[25%] left-[60%] animate-float" delay={2} />
      <FloatingCloud className="w-28 h-10 top-[8%] left-[35%] animate-float-slow" delay={0.5} />

      {/* Floating stars */}
      <FloatingStar className="top-[12%] left-[20%]" delay={0} />
      <FloatingStar className="top-[18%] right-[25%]" delay={0.8} />
      <FloatingStar className="top-[8%] left-[50%]" delay={1.5} />
      <FloatingStar className="top-[22%] right-[40%]" delay={0.3} />
      <FloatingStar className="top-[5%] right-[15%]" delay={2} />
      <FloatingStar className="top-[30%] left-[15%]" delay={1.2} />
      {/* Extra stars only visible in dark night sky */}
      <FloatingStar className="top-[10%] left-[8%] hidden dark:block" delay={0.4} />
      <FloatingStar className="top-[35%] right-[8%] hidden dark:block" delay={1.1} />
      <FloatingStar className="top-[28%] left-[45%] hidden dark:block w-1.5 h-1.5" delay={1.8} />
      <FloatingStar className="top-[15%] left-[70%] hidden dark:block" delay={0.6} />

      {/* Mountain silhouette — light variant */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none dark:hidden">
        <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
          <path fill="#b2bec3" fillOpacity="0.35" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z" />
          <path fill="#dfe6e9" fillOpacity="0.5" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Mountain silhouette — dark night variant */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none hidden dark:block">
        <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
          <path fill="#2a2a55" fillOpacity="0.7" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z" />
          <path fill="#1a1a3a" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L0,320Z" />
        </svg>
      </div>

      {/* Castle silhouette */}
      <div className="absolute bottom-0 right-[5%] opacity-10 dark:opacity-20 pointer-events-none hidden md:block text-adventure-dark dark:text-[#4a4a8a]">
        <svg viewBox="0 0 200 200" className="w-40 h-40" fill="currentColor">
          <rect x="30" y="80" width="140" height="120" />
          <rect x="50" y="40" width="30" height="40" />
          <rect x="120" y="40" width="30" height="40" />
          <rect x="75" y="60" width="50" height="20" />
          <polygon points="50,40 65,10 80,40" />
          <polygon points="120,40 135,10 150,40" />
          <rect x="80" y="130" width="40" height="70" fill="#f0f4ff" rx="20" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <div className="animate-fade-in">
          <div className="inline-block mb-6">
            <span className="bg-white/80 dark:bg-night-bg/80 backdrop-blur-sm text-adventure-purple font-heading text-sm md:text-base px-6 py-2 rounded-full shadow-md border border-adventure-purple/20">
              ⚔️ FULL STACK QUEST
            </span>
          </div>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-slide-up drop-shadow-lg">
          {personalInfo.tagline}
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto animate-slide-up animation-delay-200 drop-shadow">
          {personalInfo.subtitle}
        </p>

        <div className="animate-slide-up animation-delay-400">
          <p className="text-white/80 font-semibold text-lg mb-2">
            {personalInfo.name}
          </p>
          <p className="text-white/70 text-sm mb-8">
            📍 {personalInfo.location}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-600">
          <a href="#projects" className="btn-primary bg-white text-adventure-purple hover:bg-adventure-gold hover:text-adventure-dark shadow-xl">
            🗺️ View My Quest
          </a>
          <a
            href="#"
            className="btn-secondary border-white text-white hover:bg-white hover:text-adventure-purple"
            download
          >
            📜 Download CV
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <a href="#about" className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}