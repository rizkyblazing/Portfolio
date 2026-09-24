import { useEffect, useRef, useState } from 'react'
import experience from '../data/experience'

function QuestCard({ quest, index, visible }) {
  const [expanded, setExpanded] = useState(false)

  const isLeft = index % 2 === 0

  const card = (
    <div className="quest-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-heading text-xl text-adventure-dark dark:text-night-text">{quest.position}</h3>
          <p className="text-adventure-purple font-semibold text-sm">{quest.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-night-muted font-mono">{quest.period}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            quest.status === 'COMPLETED'
              ? 'bg-adventure-green/10 text-adventure-green'
              : 'bg-adventure-gold/10 text-adventure-gold'
          }`}>
            {quest.status}
          </span>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="mb-4">
        <h4 className="font-heading text-sm text-adventure-purple mb-2">Responsibilities:</h4>
        <ul className="space-y-1">
          {(expanded ? quest.responsibilities : quest.responsibilities.slice(0, 4)).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-night-muted">
              <span className="text-adventure-gold mt-0.5 flex-shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
        {quest.responsibilities.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-adventure-purple text-xs font-semibold mt-2 hover:underline"
          >
            {expanded ? 'Show less' : `+${quest.responsibilities.length - 4} more`}
          </button>
        )}
      </div>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quest.technologies.map((tech) => (
          <span key={tech} className="text-xs bg-adventure-purple/10 text-adventure-purple font-semibold px-3 py-1 rounded-full">
            {tech}
          </span>
        ))}
      </div>

      {/* Achievements */}
      {quest.achievements && quest.achievements.length > 0 && (
        <div className="pt-3 border-t border-gray-100 dark:border-white/10">
          <h4 className="font-heading text-sm text-adventure-green mb-2">🏆 Achievements:</h4>
          <ul className="space-y-1">
            {quest.achievements.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-night-muted">
                <span className="text-adventure-green mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <div
      className={`relative md:grid md:grid-cols-2 md:gap-10 pl-10 md:pl-0 mb-12 last:mb-0 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Timeline node */}
      <div className="absolute left-3 md:left-1/2 top-0 w-7 h-7 -translate-x-1/2 rounded-full bg-adventure-purple flex items-center justify-center shadow-lg z-10">
        <span className="text-white text-xs font-bold">#{String(quest.id).padStart(2, '0')}</span>
      </div>

      {isLeft ? (
        <>
          {card}
          <div className="hidden md:block" />
        </>
      ) : (
        <>
          <div className="hidden md:block" />
          {card}
        </>
      )}
    </div>
  )
}

export default function Experience() {
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
    <section id="experience" ref={sectionRef} className="py-20 px-4 bg-white dark:bg-night-bgAlt relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-adventure-purple">📜 Quest Log</h2>
        <p className="section-subtitle">Work experience and professional journey</p>

        <div className="relative">
          {/* Timeline line — left on mobile, center on desktop */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-adventure-purple/20" />

          {experience.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}