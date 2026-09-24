import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const swordRef = useRef(null)
  const trailRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const lastSpawn = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const spawnStar = (x, y, size, dur) => {
      const el = document.createElement('div')
      el.className = 'cursor-star'
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      el.style.setProperty('--tx', `${(Math.random() - 0.5) * 50}px`)
      el.style.setProperty('--ty', `${(Math.random() - 0.5) * 50 - 20}px`)
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.animationDuration = `${dur}s`
      trailRef.current.appendChild(el)
      setTimeout(() => el.remove(), dur * 1000 + 100)
    }

    const tick = (ts) => {
      const { x, y } = mouse.current
      pos.current.x += (x - pos.current.x) * 0.18
      pos.current.y += (y - pos.current.y) * 0.18

      if (swordRef.current) {
        swordRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px) rotate(-45deg)`
      }

      if (x > 0 && ts - lastSpawn.current > 55) {
        lastSpawn.current = ts
        const sx = x + (Math.random() - 0.5) * 16
        const sy = y + (Math.random() - 0.5) * 16
        spawnStar(sx, sy, 6 + Math.random() * 5, 0.6 + Math.random() * 0.3)
      }

      raf.current = requestAnimationFrame(tick)
    }

    const onClick = (e) => {
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6
        const dist = 12 + Math.random() * 18
        spawnStar(
          e.clientX + Math.cos(a) * dist,
          e.clientY + Math.sin(a) * dist,
          8 + Math.random() * 6,
          0.5 + Math.random() * 0.2
        )
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={trailRef} className="fixed inset-0 pointer-events-none z-[998]" />
      <div ref={swordRef} className="custom-cursor pointer-events-none z-[999]" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
          <path
            d="M16.1 3 L19.5 6.5 L17.8 18 L14.4 18 L12.7 6.5 Z"
            fill="#e6e9f0"
            stroke="#2d3436"
            strokeWidth="0.8"
          />
          <path d="M16.1 3 L19.5 6.5 L18.2 8 L15 5 Z" fill="#fff" opacity="0.7" />
          <rect x="11.2" y="17.3" width="9.8" height="4" rx="1.5" fill="#fdcb6e" stroke="#2d3436" strokeWidth="0.6" />
          <rect x="14.6" y="21.3" width="3" height="6" rx="1" fill="#6c5ce7" stroke="#2d3436" strokeWidth="0.5" />
          <circle cx="16.1" cy="27.5" r="2.5" fill="#fdcb6e" stroke="#2d3436" strokeWidth="0.5" />
        </svg>
      </div>
    </>
  )
}