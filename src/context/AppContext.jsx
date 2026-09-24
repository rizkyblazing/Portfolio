import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import useAdventureMusic from '../hooks/useAdventureMusic'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  })
  const music = useAdventureMusic()

  useEffect(() => {
    const apply = () => {
      const dark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => { if (theme === 'system') apply() }
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        musicOn: music.musicOn,
        toggleMusic: music.toggle,
        startMusic: music.play,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}