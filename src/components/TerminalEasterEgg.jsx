import { useState, useEffect, useRef } from 'react'

const COMMANDS = {
  whoami: ['Full Stack Developer', '', 'A traveler in the realm of technology.'],
  skills: [
    'Networking',
    'System Administration',
    'CCTV',
    'VoIP',
    'Server',
    'Troubleshooting',
  ],
  status: ['ALL SYSTEMS OPERATIONAL ✔'],
  start_quest: ['Welcome, Adventurer.'],
  help: [
    'Available commands:',
    '  whoami      - who am I',
    '  skills      - list my skills',
    '  status      - system status',
    '  start_quest - begin the adventure',
    '  clear       - clear terminal',
    '  help        - show this help',
  ],
  infinite: ['This is the never-ending quest. It never ends. And that\'s the point.'],
  sword: ['You swing your virtual sword. Nothing happens. This is a terminal, not a game. (Yet.)'],
}

export default function TerminalEasterEgg() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([
    '> Welcome to the IT Support Terminal!',
    'Type "help" for available commands, or "start_quest".',
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history, isTyping])

  const executeCommand = (command) => {
    const cmd = command.trim().toLowerCase()

    if (!cmd) return

    setHistory((prev) => [...prev, `> ${command}`, ...(COMMANDS[cmd] || [`Unknown command: "${command}". Type "help" for available commands.`])])
  }

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return

    const command = input
    setInput('')

    if (command.trim().toLowerCase() === 'clear') {
      setHistory([])
      return
    }

    setIsTyping(true)
    setTimeout(() => {
      executeCommand(command)
      setIsTyping(false)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-lg bg-[#1a1a2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16213e]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-adventure-coral/80" />
            <span className="w-3 h-3 rounded-full bg-adventure-gold/80" />
            <span className="w-3 h-3 rounded-full bg-adventure-green/80" />
          </div>
          <span className="text-white/60 text-xs font-mono ml-3 hidden sm:block">
            adventurer@land-of-oo: ~/quests
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/50 hover:text-white text-sm px-2 transition-colors"
          aria-label="Close terminal"
        >
          ✕
        </button>
      </div>

      {/* Terminal output */}
      <div
        ref={outputRef}
        className="terminal p-4 h-64 overflow-y-auto text-sm space-y-1"
      >
        {history.map((line, index) => (
          <div key={index} className={line.startsWith('>') ? 'text-adventure-gold' : 'text-white/80'}>
            {line}
          </div>
        ))}
        {isTyping && <div className="text-white/50 animate-pulse">▊</div>}
      </div>

      {/* Terminal input */}
      <div className="flex items-center px-4 py-3 bg-[#16213e]">
        <span className="terminal text-adventure-gold mr-2">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="terminal bg-transparent outline-none flex-1 text-sm"
          placeholder="type a command... (hint: help)"
          aria-label="Terminal command input"
        />
      </div>

      {/* Hint */}
      <div className="px-4 py-1.5 bg-[#0f3460] text-white/40 text-[10px] font-mono">
        Tip: Ctrl + ` to toggle • Esc to close
      </div>
    </div>
  )
}