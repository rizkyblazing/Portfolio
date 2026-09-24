import { useState, useEffect } from 'react'
import personalInfo from '../data/personalInfo'
import { useApp } from '../context/AppContext'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { theme, toggleTheme, musicOn, toggleMusic } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navLinks.map(link => link.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-night-bg/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-heading text-lg md:text-xl text-adventure-purple">
              {personalInfo.name === '[NAMA LENGKAP]' ? 'Portfolio' : personalInfo.name}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'bg-adventure-purple text-white'
                    : 'text-adventure-dark dark:text-night-text hover:bg-adventure-purple/10 hover:text-adventure-purple'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Toggles */}
            <div className="ml-3 flex items-center gap-1.5">
              <button
                onClick={toggleMusic}
                className="p-2.5 rounded-xl bg-white/70 dark:bg-night-card text-adventure-dark dark:text-night-text
                  hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20 transition-colors
                  text-base leading-none"
                aria-label={musicOn ? 'Mute music' : 'Play music'}
                title={musicOn ? 'Mute music' : 'Play music'}
              >
                {musicOn ? '🎵' : '🔇'}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/70 dark:bg-night-card text-adventure-dark dark:text-night-text
                  hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20 transition-colors
                  text-base leading-none"
                aria-label="Toggle dark mode"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={toggleMusic}
              className="p-2 rounded-lg hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20 transition-colors text-lg leading-none"
              aria-label={musicOn ? 'Mute music' : 'Play music'}
            >
              {musicOn ? '🎵' : '🔇'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20 transition-colors text-lg leading-none"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20 transition-colors"
              aria-label="Toggle navigation"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-adventure-dark dark:bg-night-text rounded transition-all duration-300 origin-left ${
                    isOpen ? 'rotate-45 translate-x-px' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-adventure-dark dark:bg-night-text rounded transition-all duration-300 ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-adventure-dark dark:bg-night-text rounded transition-all duration-300 origin-left ${
                    isOpen ? '-rotate-45 translate-x-px' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 dark:bg-night-bg/95 backdrop-blur-md border-t border-gray-100 dark:border-white/10 px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                activeSection === link.href.slice(1)
                  ? 'bg-adventure-purple text-white'
                  : 'text-adventure-dark dark:text-night-text hover:bg-adventure-purple/10 dark:hover:bg-adventure-purple/20'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}