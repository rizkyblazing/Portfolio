import { useEffect, useRef, useState } from 'react'
import projects from '../data/projects'

function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-night-card rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-heading text-adventure-gold bg-adventure-gold/10 px-3 py-1 rounded-full">
              Quest #{project.questNumber}
            </span>
            <h3 className="font-heading text-2xl text-adventure-dark dark:text-night-text mt-2">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center transition-colors text-adventure-dark dark:text-night-text"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 dark:text-night-muted mb-6 leading-relaxed">{project.description}</p>

        <h4 className="font-heading text-sm text-adventure-purple mb-3">Details:</h4>
        <ul className="space-y-2 mb-6">
          {project.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-sm text-gray-600 dark:text-night-muted">
              <span className="text-adventure-gold mt-0.5">⚔️</span>
              {detail}
            </li>
          ))}
        </ul>

        <div>
          <h4 className="font-heading text-sm text-adventure-purple mb-3">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-xs bg-adventure-purple/10 text-adventure-purple font-semibold px-3 py-1.5 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index, visible, onSelect }) {
  return (
    <div
      className={`card group cursor-pointer transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onClick={() => onSelect(project)}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-12 h-12 rounded-xl bg-adventure-gold/20 flex items-center justify-center text-xl font-heading text-adventure-gold">
          #{project.questNumber}
        </span>
        <h3 className="font-heading text-lg text-adventure-dark dark:text-night-text group-hover:text-adventure-purple transition-colors">
          {project.title}
        </h3>
      </div>

      <p className="text-gray-500 dark:text-night-muted text-sm mb-4 line-clamp-3">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="text-xs bg-adventure-green/10 text-adventure-green font-semibold px-2 py-1 rounded-full">
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="text-xs text-gray-400 dark:text-night-muted px-2 py-1">+{project.technologies.length - 4}</span>
        )}
      </div>

      <div className="flex items-center text-adventure-purple text-sm font-semibold group-hover:gap-3 gap-1 transition-all">
        View Quest
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  )
}

export default function Projects() {
  const [visible, setVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
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

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  return (
    <section id="projects" ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-adventure-light to-white dark:from-night-bg dark:to-night-bgAlt relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-adventure-gold/30 to-transparent dark:via-adventure-gold/40" />

      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-adventure-purple">🗺️ Completed Quests</h2>
        <p className="section-subtitle">Projects and implementations I have completed</p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              visible={visible}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}