import { useEffect, useRef, useState } from 'react'
import skills from '../data/skills'

function SkillCard({ skill, index, visible }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`card group transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{skill.icon}</span>
        <div>
          <h3 className="font-heading text-lg text-adventure-dark dark:text-night-text">{skill.category}</h3>
          <span className="text-xs font-semibold text-adventure-purple bg-adventure-purple/10 px-2 py-0.5 rounded-full">
            {skill.level}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-adventure-purple to-adventure-sky transition-all duration-1000 ease-out"
            style={{
              width: visible ? `${skill.levelPercent}%` : '0%',
              transitionDelay: `${index * 100 + 300}ms`,
            }}
          />
        </div>
      </div>

      {/* Skill items */}
      <div className="flex flex-wrap gap-2">
        {skill.items.map((item) => (
          <span
            key={item}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
              hovered
                ? 'bg-adventure-purple text-white shadow-md'
                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-night-muted hover:bg-adventure-purple/10'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
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
    <section id="skills" ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-white to-adventure-light dark:from-night-bgAlt dark:to-night-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-adventure-purple/20 to-transparent dark:via-adventure-purple/30" />

      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-adventure-purple">🎒 My Inventory</h2>
        <p className="section-subtitle">Skills and tools collected along the journey</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}