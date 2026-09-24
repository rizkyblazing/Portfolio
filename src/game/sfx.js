let ctx = null

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function beep(freq, dur, type = 'square', vol = 0.04, when = 0) {
  try {
    const c = ac()
    const o = c.createOscillator()
    const g = c.createGain()
    const t = c.currentTime + when
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(c.destination)
    o.start(t)
    o.stop(t + dur + 0.02)
  } catch {
    /* ignore audio errors */
  }
}

export const sfx = {
  encounter() {
    beep(440, 0.08, 'triangle', 0.05)
    beep(587, 0.1, 'triangle', 0.04, 0.09)
    beep(880, 0.15, 'triangle', 0.05, 0.18)
  },
  attack() {
    beep(220, 0.12, 'sawtooth', 0.04)
    beep(110, 0.15, 'sawtooth', 0.03, 0.05)
  },
  hit() {
    beep(180, 0.1, 'square', 0.04)
  },
  heal() {
    beep(523, 0.1, 'triangle', 0.05)
    beep(659, 0.1, 'triangle', 0.05, 0.08)
    beep(784, 0.12, 'triangle', 0.05, 0.16)
  },
  capture() {
    beep(660, 0.08, 'square', 0.04)
    beep(523, 0.08, 'square', 0.04, 0.08)
    beep(392, 0.1, 'square', 0.04, 0.16)
  },
  caught() {
    ;[523, 659, 784, 1047].forEach((f, i) => beep(f, 0.16, 'triangle', 0.06, i * 0.11))
  },
  low() {
    beep(200, 0.15, 'triangle', 0.04)
  },
}