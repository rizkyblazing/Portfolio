import { useEffect, useRef, useState } from 'react'
import personalInfo from '../data/personalInfo'

export default function About() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 px-4 bg-white dark:bg-night-bgAlt relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-adventure-gold/10 dark:bg-adventure-gold/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-adventure-purple/10 dark:bg-adventure-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-adventure-purple">⚔️ Meet the Adventurer</h2>
        <p className="section-subtitle">The person behind the screen</p>

        <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Character Card */}
            <div className="card p-8 border-2 border-adventure-gold/30 relative">
              {/* Card header */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-adventure-gold text-white font-heading text-xs px-4 py-1 rounded-full shadow-md">
                CHARACTER PROFILE
              </div>

              <div className="mt-4 space-y-4">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-adventure-purple to-adventure-sky flex items-center justify-center text-4xl shadow-lg mb-6">
                  🧙‍♂️
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="flex">
                    <span className="w-28 text-adventure-purple font-bold">Name</span>
                    <span className="text-gray-400 mr-2">:</span>
                    <span className="font-semibold text-adventure-dark dark:text-night-text">{personalInfo.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-adventure-purple font-bold">Role</span>
                    <span className="text-gray-400 mr-2">:</span>
                    <span className="font-semibold text-adventure-dark dark:text-night-text">{personalInfo.role}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-adventure-purple font-bold">Level</span>
                    <span className="text-gray-400 mr-2">:</span>
                    <span className="font-semibold text-adventure-dark dark:text-night-text">{personalInfo.level}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-adventure-purple font-bold">Class</span>
                    <span className="text-gray-400 mr-2">:</span>
                    <span className="font-semibold text-adventure-dark dark:text-night-text">{personalInfo.classType}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-adventure-purple font-bold">Location</span>
                    <span className="text-gray-400 mr-2">:</span>
                    <span className="font-semibold text-adventure-dark dark:text-night-text">{personalInfo.location}</span>
                  </div>
                </div>

                {/* Specialty */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
                  <h4 className="font-heading text-adventure-purple mb-3 text-sm">SPECIALTY:</h4>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="bg-adventure-purple/10 text-adventure-purple text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="font-heading text-xl text-adventure-purple mb-4">📜 Story So Far</h3>
                <p className="text-gray-600 dark:text-night-muted leading-relaxed text-base">
                  {personalInfo.about}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center py-6">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="font-heading text-adventure-purple text-sm">Problem Solver</div>
                  <div className="text-xs text-gray-500 dark:text-night-muted mt-1">Always finding the root cause</div>
                </div>
                <div className="card text-center py-6">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-heading text-adventure-purple text-sm">Fast Responder</div>
                  <div className="text-xs text-gray-500 dark:text-night-muted mt-1">Quick and effective solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}