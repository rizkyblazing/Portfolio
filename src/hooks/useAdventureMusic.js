import { useRef, useState, useCallback } from 'react'

/* Original adventure-style composition (D major, I–V–vi–IV) built with Web Audio.
   Melody, harmony, bass and percussion are composed specifically for this project. */

const TEMPO = 120
const STEP_DUR = 60 / TEMPO / 2

/* Lead melody (32 steps = 4 bars) - original motif with sequential climb & answer */
const MELODY = [
  74, 76, 78, 0, 81, 78, 76, 74,
  81, 85, 81, 0, 83, 81, 78, 76,
  78, 81, 83, 0, 86, 83, 81, 78,
  79, 81, 83, 0, 86, 83, 81, 79,
]

/* Bass roots per bar (D, A, Bm, G) - root hits on beats 1 and the & of 4 */
const BASS = [
  50, 0, 0, 50, 0, 0, 50, 0,
  57, 0, 0, 57, 0, 0, 57, 0,
  59, 0, 0, 59, 0, 0, 59, 0,
  55, 0, 0, 55, 0, 0, 55, 0,
]

/* Chord pads per bar (D, A, Bm, G) in a mid register */
const CHORDS = [
  [62, 66, 69],
  [57, 61, 64],
  [59, 62, 66],
  [55, 59, 62],
]

const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12)

let shared = null

function createEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const master = ctx.createGain()
  master.gain.value = 0.55
  master.connect(ctx.destination)

  /* Cached noise for hi-hats */
  const noiseDur = 0.06
  const noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * noiseDur), ctx.sampleRate)
  {
    const d = noiseBuffer.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }

  let currentStep = 0
  let nextNoteTime = ctx.currentTime + 0.1
  let timer = null

  function playNote(freq, time, dur, type, vol) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(vol, time + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)
    osc.connect(gain)
    gain.connect(master)
    osc.start(time)
    osc.stop(time + dur + 0.05)
  }

  function kick(time) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.setValueAtTime(150, time)
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.1)
    gain.gain.setValueAtTime(0.14, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12)
    osc.connect(gain)
    gain.connect(master)
    osc.start(time)
    osc.stop(time + 0.15)
  }

  function hat(time) {
    const dur = 0.04
    const n = ctx.createBufferSource()
    n.buffer = noiseBuffer
    const filt = ctx.createBiquadFilter()
    filt.type = 'highpass'
    filt.frequency.value = 6000
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.05, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)
    n.connect(filt)
    filt.connect(gain)
    gain.connect(master)
    n.start(time)
    n.stop(time + dur)
  }

  function scheduleStep(step) {
    const t = nextNoteTime
    const bar = Math.floor(step / 8)
    const beat = step % 8

    /* Percussion */
    if (beat === 0 || beat === 4) kick(t)
    if (beat === 2 || beat === 6) hat(t)

    /* Chord pads (held across the bar) */
    if (beat === 0) {
      const chord = CHORDS[bar % CHORDS.length]
      for (const f of chord) playNote(midiToFreq(f), t, STEP_DUR * 7.5, 'triangle', 0.05)
    }

    /* Bass */
    const bass = BASS[step % BASS.length]
    if (bass > 0) {
      const f = midiToFreq(bass)
      playNote(f, t, STEP_DUR * 1.8, 'sine', 0.13)
      playNote(f / 2, t, STEP_DUR * 1.8, 'triangle', 0.05)
    }

    /* Lead melody with sparkle */
    const mel = MELODY[step % MELODY.length]
    if (mel > 0) {
      const f = midiToFreq(mel)
      playNote(f, t, STEP_DUR * 0.92, 'triangle', 0.1)
      playNote(f * 2, t, STEP_DUR * 0.5, 'sine', 0.025)
    }

    nextNoteTime += STEP_DUR
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + 0.15) {
      scheduleStep(currentStep)
      currentStep++
    }
    timer = setTimeout(scheduler, 35)
  }

  return {
    ctx,
    start() {
      if (ctx.state === 'suspended') ctx.resume()
      currentStep = 0
      nextNoteTime = ctx.currentTime + 0.1
      if (!timer) timer = setTimeout(scheduler, 40)
    },
    stop() {
      if (timer) { clearTimeout(timer); timer = null }
    },
  }
}

export default function useAdventureMusic() {
  const [musicOn, setMusicOn] = useState(false)

  const play = useCallback(() => {
    if (!shared) shared = createEngine()
    shared.start()
    setMusicOn(true)
  }, [])

  const stop = useCallback(() => {
    if (shared) {
      shared.stop()
      setMusicOn(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (musicOn) stop()
    else play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicOn])

  return { musicOn, play, stop, toggle }
}