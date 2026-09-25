import { useRef, useState, useEffect, useCallback } from 'react'
import techMons from '../data/techMons'
import { createTechMonEngine } from '../game/engine'

const BUGDEX_KEY = 'techmon_bugdex'

const loadDex = () => {
  try {
    return JSON.parse(localStorage.getItem(BUGDEX_KEY)) || []
  } catch {
    return []
  }
}

const saveDex = (ids) => {
  try {
    localStorage.setItem(BUGDEX_KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

const KEYMAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
}

const DIR_ICONS = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
}

function DPad({ onMove, onRelease }) {
  const bind = (dir) => ({
    onPointerDown: (e) => {
      e.preventDefault()
      onMove(dir)
    },
    onPointerUp: () => onRelease(dir),
    onPointerLeave: () => onRelease(dir),
    onPointerCancel: () => onRelease(dir),
    onContextMenu: (e) => e.preventDefault(),
  })

  const btn = 'w-14 h-14 rounded-xl bg-adventure-purple/80 hover:bg-adventure-purple text-white text-lg font-bold flex items-center justify-center select-none active:scale-90 transition-transform shadow-lg touch-none'

  return (
    <div className="absolute bottom-3 left-3 grid grid-cols-3 gap-1.5 z-10">
      <div />
      <button className={btn} {...bind('up')} aria-label="Move up">{DIR_ICONS.up}</button>
      <div />
      <button className={btn} {...bind('left')} aria-label="Move left">{DIR_ICONS.left}</button>
      <button className={`${btn} opacity-0 pointer-events-none`} aria-hidden="true" tabIndex={-1}>{DIR_ICONS.down}</button>
      <button className={btn} {...bind('right')} aria-label="Move right">{DIR_ICONS.right}</button>
      <div />
      <button className={btn} {...bind('down')} aria-label="Move down">{DIR_ICONS.down}</button>
      <div />
    </div>
  )
}

function HpBar({ hp, max, compact }) {
  const pct = Math.max(0, (hp / max) * 100)
  const color = pct > 50 ? 'bg-adventure-green' : pct > 25 ? 'bg-adventure-gold' : 'bg-adventure-coral'
  return (
    <div className={`${compact ? 'h-3' : 'h-4'} w-full bg-black/20 dark:bg-white/10 rounded-full overflow-hidden`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function TechMonGame() {
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState('menu')
  const [battle, setBattle] = useState(null)
  const [banner, setBanner] = useState(null)
  const [dex, setDex] = useState([])
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const emitRef = useRef(() => {})
  const bannerTimerRef = useRef(null)
  const screenRef = useRef('menu')
  screenRef.current = screen

  const refreshDex = useCallback(() => setDex(loadDex()), [])

  const handleEvent = useCallback(
    (type, data) => {
      if (type === 'encounter') {
        setBattle(data)
        setBanner(null)
      } else if (type === 'battle') {
        setBattle(data)
      } else if (type === 'battleEnd') {
        if (data.result === 'caught') {
          const next = Array.from(new Set([...loadDex(), data.enemy.id]))
          saveDex(next)
          setDex(next)
          setBanner({
            name: data.enemy.name,
            emoji: data.enemy.emoji,
            type: data.enemy.type,
          })
          if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
          bannerTimerRef.current = setTimeout(() => {
            setBanner(null)
            bannerTimerRef.current = null
          }, 2800)
        }
        setBattle(null)
      }
    },
    []
  )
  emitRef.current = handleEvent

  const openOverlay = useCallback(() => {
    setDex(loadDex())
    setOpen(true)
    setScreen('menu')
  }, [])

  const closeOverlay = useCallback(() => {
    setOpen(false)
    setScreen('menu')
    setBattle(null)
    setBanner(null)
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = null
    if (engineRef.current) engineRef.current.destroy()
    engineRef.current = null
  }, [])

  const startGame = useCallback(() => {
    setScreen('game')
    setBattle(null)
    setBanner(null)
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = null
  }, [])

  /* Engine lifecycle */
  useEffect(() => {
    if (!open || screen !== 'game') return
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = createTechMonEngine(canvas, (type, data) => emitRef.current(type, data))
    engineRef.current = engine
    engine.start()
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [open, screen])

  /* Keyboard controls */
  useEffect(() => {
    if (!open) return
    const down = (e) => {
      if (e.key === 'Escape') {
        closeOverlay()
        return
      }
      if (screenRef.current !== 'game') return
      if (battle) return
      const dir = KEYMAP[e.key]
      if (dir) {
        e.preventDefault()
        engineRef.current?.move(dir)
      }
    }
    const up = (e) => {
      const dir = KEYMAP[e.key]
      if (dir) engineRef.current?.releaseKey(dir)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [open, battle, closeOverlay])

  const battleAction = (action) => {
    engineRef.current?.battleAction(action)
  }

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={openOverlay}
          className="fixed left-4 bottom-4 z-[80] w-14 h-14 rounded-2xl bg-gradient-to-br from-adventure-purple to-adventure-sky
            text-white text-2xl shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300
            flex items-center justify-center"
          aria-label="Open Tech Mon game"
          title="Play Tech Mon!"
        >
          🎮
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[110] bg-night-bg/95 dark:bg-[#05061a]/95 backdrop-blur-md overflow-y-auto">
          <div className="min-h-full flex flex-col max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl text-adventure-gold">🎮 TECH MON</h2>
              <button
                onClick={closeOverlay}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close game"
              >
                ✕
              </button>
            </div>

            {/* MENU */}
            {screen === 'menu' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
                <div className="text-7xl animate-float">
                  <span role="img" aria-label="bug">🐛</span>
                  <span role="img" aria-label="sword">⚔️</span>
                  <span role="img" aria-label="disk">💾</span>
                </div>
                <h3 className="font-heading text-3xl md:text-4xl text-white">Bug Catcher Quest</h3>
                <p className="text-white/60 max-w-md text-sm md:text-base">
                  Walk through the land of systems, encounter wild IT bugs,
                  battle them with your trusty tools, and catch them all into your Bugdex.
                </p>
                <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
                  <button
                    onClick={startGame}
                    className="bg-adventure-gold hover:bg-adventure-gold/90 text-adventure-dark font-heading text-lg px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
                  >
                    START ADVENTURE ▶
                  </button>
                  <button
                    onClick={() => { refreshDex(); setScreen('bugdex') }}
                    className="bg-adventure-purple/20 hover:bg-adventure-purple/40 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all"
                  >
                    BUGDEX ({dex.length}/{techMons.length})
                  </button>
                  <button
                    onClick={() => setScreen('help')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all"
                  >
                    HOW TO PLAY
                  </button>
                </div>
              </div>
            )}

            {/* GAME */}
            {screen === 'game' && (
              <div className="flex-1">
                <div className="relative">
                  {/* Canvas + controls: always mounted, hidden during battle */}
                  <div className={`${battle ? 'hidden' : ''} relative rounded-2xl overflow-hidden ring-4 ring-adventure-purple/30 shadow-2xl select-none`}>
                    <canvas ref={canvasRef} className="w-full h-auto block" />
                    <DPad
                      onMove={(dir) => engineRef.current?.move(dir)}
                      onRelease={(dir) => engineRef.current?.releaseKey(dir)}
                    />
                    <div className="absolute top-3 right-3 z-10 flex gap-2">
                      <button
                        onClick={() => engineRef.current?.resetPlayer()}
                        className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-night-card text-xs font-bold text-adventure-purple shadow hover:scale-105 transition-transform"
                        title="Return to start"
                      >
                        ↺ Hub
                      </button>
                    </div>
                  </div>

                  {/* BATTLE UI (sibling overlay, canvas stays mounted below) */}
                  {battle && (
                    <div className="bg-gradient-to-b from-night-bgAlt to-night-bg rounded-2xl ring-4 ring-adventure-gold/40 shadow-2xl p-4 md:p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-heading text-white text-lg">⚔️ BATTLE</span>
                        <span className="text-xs font-mono text-white/40">FSK T Tech</span>
                      </div>

                      {/* Enemy card */}
                      <div className="flex items-center gap-4 mb-4 bg-white/5 rounded-xl p-4">
                        <div className="text-6xl md:text-7xl animate-float flex-shrink-0">{battle.enemy.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading text-white text-lg md:text-xl">{battle.enemy.name}</span>
                            <span className="text-xs bg-adventure-pink/20 text-adventure-pink font-bold px-2 py-0.5 rounded-full">
                              {battle.enemy.type}
                            </span>
                            <span className="text-xs bg-adventure-gold/20 text-adventure-gold font-bold px-2 py-0.5 rounded-full uppercase">
                              {battle.enemy.rarity}
                            </span>
                          </div>
                          <p className="text-white/60 text-xs mb-2 truncate">{battle.enemy.desc}</p>
                          <div className="flex items-center gap-2">
                            <HpBar hp={battle.enemyHP} max={battle.enemyMax} compact />
                            <span className="text-xs font-mono text-white/60 flex-shrink-0">
                              {battle.enemyHP}/{battle.enemyMax} HP
                            </span>
                          </div>
                          {battle.diagnosed && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-adventure-green">
                              🔍 DIAGNOSED — capture chance up!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Player HP */}
                      <div className="flex items-center gap-3 mb-3 bg-white/5 rounded-xl p-3">
                        <span className="text-3xl">🧑‍💻</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-sm">YOU · IT Support Hero</span>
                            <span className="text-xs font-mono text-white/60">{battle.playerHP}/100 HP</span>
                          </div>
                          <HpBar hp={battle.playerHP} max={100} compact />
                        </div>
                      </div>

                      {/* Message log */}
                      <div className="h-24 md:h-20 bg-black/30 rounded-xl p-3 mb-3 overflow-y-auto space-y-1">
                        {battle.message.map((m, i) => (
                          <p key={i} className="text-xs md:text-sm text-white/85 font-mono leading-snug whitespace-pre-line">
                            {m}
                          </p>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <button onClick={() => battleAction('ping')} className="bg-adventure-coral hover:bg-adventure-coral/90 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          PING ⚡
                        </button>
                        <button onClick={() => battleAction('diagnose')} className="bg-adventure-sky hover:bg-adventure-sky/90 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          DIAGNOSE 🔍
                        </button>
                        <button onClick={() => battleAction('fix')} className="bg-adventure-green hover:bg-adventure-green/90 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          FIX 🛠️
                        </button>
                        <button onClick={() => battleAction('capture')} className="bg-adventure-gold hover:bg-adventure-gold/90 text-adventure-dark font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          CAPTURE 💾
                        </button>
                        <button onClick={() => battleAction('run')} className="col-span-2 md:col-span-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                          RUN 💨
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Catch banner */}
                  {banner && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl z-20 animate-fade-in">
                      <div className="text-center animate-slide-up bg-white dark:bg-night-card rounded-2xl p-8 shadow-2xl max-w-xs mx-4">
                        <div className="text-6xl mb-3">{banner.emoji}</div>
                        <p className="font-heading text-lg text-adventure-dark dark:text-night-text mb-1">GOTCHA!</p>
                        <p className="text-sm text-gray-600 dark:text-night-muted mb-2">
                          {banner.name} was added to your Bugdex!
                        </p>
                        <button
                          onClick={() => {
                            if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
                            bannerTimerRef.current = null
                            setBanner(null)
                          }}
                          className="mt-2 bg-adventure-purple text-white text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform"
                        >
                          Continue ▶
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BUGDEX */}
            {screen === 'bugdex' && (
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-4 text-center">
                  Caught {dex.length} of {techMons.length} bugs
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {techMons.map((mon) => {
                    const caught = dex.includes(mon.id)
                    return (
                      <div
                        key={mon.id}
                        className={`rounded-2xl p-4 text-center transition-all ${
                          caught
                            ? 'bg-white/10 hover:bg-white/15 shadow-lg'
                            : 'bg-white/5'
                        }`}
                      >
                        <div className={`text-4xl mb-2 ${caught ? '' : 'opacity-20 grayscale brightness-0'}`}>
                          {mon.emoji}
                        </div>
                        {caught ? (
                          <>
                            <div className="font-heading text-sm text-white">{mon.name}</div>
                            <div className="text-[10px] text-adventure-pink font-bold mt-0.5">{mon.type}</div>
                            <div className="text-[10px] text-white/40 mt-0.5">
                              {mon.hp} HP · {mon.rarity}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-heading text-sm text-white/40">???</div>
                            <div className="text-[10px] text-white/30 mt-0.5">Undiscovered</div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={() => setScreen('menu')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* HELP */}
            {screen === 'help' && (
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-5">
                    <h4 className="font-heading text-white mb-3">⌨️ On Desktop</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li><span className="font-bold text-adventure-gold">WASD / Arrows</span> — walk around</li>
                      <li><span className="font-bold text-adventure-gold">Esc</span> — close game</li>
                      <li><span className="font-bold text-adventure-gold">Tall grass</span> triggers encounters</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5">
                    <h4 className="font-heading text-white mb-3">📱 On Mobile</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li><span className="font-bold text-adventure-gold">D-pad</span> — walk around</li>
                      <li><span className="font-bold text-adventure-gold">Tap buttons</span> during battle</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-5 md:col-span-2">
                    <h4 className="font-heading text-white mb-3">⚔️ Battle Tips</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li><span className="font-bold text-adventure-coral">PING</span> — reliable damage</li>
                      <li><span className="font-bold text-adventure-sky">DIAGNOSE</span> — boost capture chance</li>
                      <li><span className="font-bold text-adventure-green">FIX</span> — heal yourself, chip the bug</li>
                      <li><span className="font-bold text-adventure-gold">CAPTURE</span> — the bug is easier to catch when HP is low</li>
                      <li>Collect all 8 bugs to complete the Bugdex! 🏆</li>
                    </ul>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={() => setScreen('menu')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}