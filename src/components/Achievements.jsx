import { useEffect, useRef, useState } from 'react'
import achievements from '../data/achievements'

function BadgeCard({ item, index, visible }) {
  return (
    <div
      className={`card text-center py-8 group hover:scale-105 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      <h3 className="font-heading text-base text-adventure-dark dark:text-night-text mb-1">{item.title}</h3>
      <p className="text-xs text-gray-500 dark:text-night-muted px-2">{item.description}</p>
    </div>
  )
}

export default function Achievements() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="achievements" ref={sectionRef} className="py-20 px-4 bg-white dark:bg-night-bgAlt relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-adventure-gold/30 to-transparent dark:via-adventure-gold/40" />

      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-adventure-purple">🏆 Achievements & Certifications</h2>
        <p className="section-subtitle">Milestones earned throughout the adventure</p>

        {/* Achievements */}
        <div className="mb-12">
          <h3 className="font-heading text-xl text-adventure-dark dark:text-night-text mb-6 text-center">
            ⭐ Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {achievements.achievements.map((item, index) => (
              <BadgeCard key={item.id} item={item} index={index} visible={visible} />
            ))}
          </div>
        </div>

        {/* Experience milestones */}
        <div className="mb-12">
          <h3 className="font-heading text-xl text-adventure-dark dark:text-night-text mb-6 text-center">
            💼 Experience
          </h3>
          <div className="flex flex-col items-center gap-4">
            {achievements.experience.map((item, index) => (
              <div key={item.id} className="w-full max-w-md">
                <BadgeCard item={item} index={index + achievements.achievements.length} visible={visible} />
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="font-heading text-xl text-adventure-dark dark:text-night-text mb-6 text-center">
            📜 Certifications
          </h3>
          <div className="flex flex-col items-center gap-4">
            {achievements.certifications.map((cert, index) => (
              <div
                key={cert.id}
                className={`card flex flex-col items-center text-center gap-3 w-full max-w-md transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + achievements.achievements.length + achievements.experience.length) * 100}ms` }}
              >
                <span className="text-3xl flex-shrink-0">{cert.icon}</span>
                <div>
                  <h4 className="font-heading text-sm text-adventure-dark dark:text-night-text">{cert.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-night-muted">{cert.issuer} • {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}