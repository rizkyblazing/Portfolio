import { useState } from 'react'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import TerminalEasterEgg from './components/TerminalEasterEgg'
import CustomCursor from './components/CustomCursor'
import Intro from './components/Intro'
import TechMonGame from './components/TechMonGame'

function App() {
  const { startMusic } = useApp()
  const [showIntro, setShowIntro] = useState(true)

  const finishIntro = () => {
    startMusic()
    setShowIntro(false)
  }

  return (
    <div className="min-h-screen bg-adventure-light dark:bg-night-bg font-body overflow-x-hidden">
      <CustomCursor />
      {showIntro && <Intro onFinish={finishIntro} />}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <Footer />
      <TerminalEasterEgg />
      <TechMonGame />
    </div>
  )
}

export default App