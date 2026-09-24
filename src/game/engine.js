import techMons from '../data/techMons'
import { sfx } from './sfx'

const TILE = 32
const COLS = 22
const ROWS = 16
const VIEW_W = COLS * TILE
const VIEW_H = ROWS * TILE

const rawMap = [
  '2222222222222222222222',
  '2000000000111100000002',
  '2040000000111110000402',
  '2000005001111111110002',
  '2000000000111111110002',
  '2400000000001111000402',
  '2000000000000111000002',
  '2000000333000000000002',
  '2000000333300000000002',
  '2000000003300000000002',
  '2004000000000000004002',
  '2000000000000000000002',
  '2111000000000000000002',
  '2111100000000400000002',
  '2111100000000000000002',
  '2222222222222222222222',
]

const MAP = rawMap.map((s) =>
  s.padEnd(COLS, '2').slice(0, COLS).split('').map(Number)
)

const WALKABLE = new Set([0, 1, 4, 5])
const ENCOUNTER_TILES = new Set([1])
const ENCOUNTER_CHANCE = 0.25
const STEP_DUR = 0.19
const PLAYER_START = { c: 6, r: 3 }

const DIRS = {
  up: { dc: 0, dr: -1 },
  down: { dc: 0, dr: 1 },
  left: { dc: -1, dr: 0 },
  right: { dc: 1, dr: 0 },
}
const DIR_ORDER = ['up', 'down', 'left', 'right']

const TILE_COLORS = {
  0: '#7bd88f',
  1: '#58c06a',
  2: '#3a9d54',
  3: '#4aa8e0',
  4: '#7bd88f',
  5: '#b8a5e8',
}

const rand = (a, b) => a + Math.random() * (b - a)

function pickEnemy() {
  const roll = Math.random()
  const pool =
    roll < 0.55
      ? techMons.filter((m) => m.rarity === 'common')
      : roll < 0.9
        ? techMons.filter((m) => m.rarity === 'rare')
        : techMons.filter((m) => m.rarity === 'legendary')
  const list = pool.length ? pool : techMons
  const base = list[Math.floor(Math.random() * list.length)]
  return { ...base, moves: base.moves.map((m) => ({ ...m })) }
}

export function createTechMonEngine(canvas, emit) {
  const ctx = canvas.getContext('2d')
  canvas.width = VIEW_W
  canvas.height = VIEW_H

  const player = {
    c: PLAYER_START.c,
    r: PLAYER_START.r,
    px: PLAYER_START.c * TILE + TILE / 2,
    py: PLAYER_START.r * TILE + TILE / 2,
    moving: false,
    from: { x: 0, y: 0 },
    toX: 0,
    toY: 0,
    stepT: 0,
  }

  let held = new Set()
  let state = 'idle'
  let battle = null
  let raf = null
  let last = 0
  let time = 0
  let destroyed = false

  const tileAt = (c, r) => {
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return 2
    return MAP[r][c]
  }

  function startStep(dir) {
    const { dc, dr } = DIRS[dir]
    const nc = player.c + dc
    const nr = player.r + dr
    if (!WALKABLE.has(tileAt(nc, nr))) return
    player.from = { x: player.c * TILE + TILE / 2, y: player.r * TILE + TILE / 2 }
    player.toX = nc * TILE + TILE / 2
    player.toY = nr * TILE + TILE / 2
    player.c = nc
    player.r = nr
    player.stepT = 0
    player.moving = true
  }

  function moveWith() {
    if (player.moving || state !== 'running') return
    for (const d of DIR_ORDER) {
      if (held.has(d)) {
        startStep(d)
        return
      }
    }
  }

  function onArrive() {
    if (ENCOUNTER_TILES.has(tileAt(player.c, player.r)) && Math.random() < ENCOUNTER_CHANCE) {
      startBattle()
    }
  }

  function update(dt) {
    if (player.moving) {
      player.stepT += dt
      const k = Math.min(player.stepT / STEP_DUR, 1)
      player.px = player.from.x + (player.toX - player.from.x) * k
      player.py = player.from.y + (player.toY - player.from.y) * k
      if (k >= 1) {
        player.px = player.toX
        player.py = player.toY
        player.moving = false
        onArrive()
      }
    } else {
      moveWith()
    }
  }

  /* ---------- Battle ---------- */

  function battleSnapshot() {
    if (!battle) return null
    return {
      enemy: { ...battle.enemy, moves: battle.enemy.moves.map((m) => ({ ...m })) },
      playerHP: battle.playerHP,
      enemyHP: battle.enemyHP,
      enemyMax: battle.enemy.hp,
      diagnosed: battle.diagnosed,
      phase: battle.phase,
      message: [...battle.message],
    }
  }

  function pushMsg(m) {
    battle.message.push(m)
    if (battle.message.length > 5) battle.message.shift()
    emit('battle', battleSnapshot())
  }

  function startBattle() {
    const enemy = pickEnemy()
    battle = {
      enemy,
      playerHP: 100,
      enemyHP: enemy.hp,
      enemyMax: enemy.hp,
      diagnosed: false,
      message: [],
      phase: 'player',
      active: true,
    }
    stopLoop()
    sfx.encounter()
    emit('encounter', battleSnapshot())
  }

  function endBattle(result, logs) {
    for (const m of logs) {
      battle.message.push(m)
      if (battle.message.length > 5) battle.message.shift()
    }
    battle.active = false
    battle.phase = 'over'
    emit('battle', battleSnapshot())
    const enemy = { ...battle.enemy }
    battle = null
    emit('battleEnd', { result, enemy })
    resumeLoop()
  }

  function enemyAttack() {
    const b = battle
    const mv = b.enemy.moves[Math.floor(Math.random() * b.enemy.moves.length)]
    const dmg = Math.round(mv.dmg + rand(0, 5))
    const actual = Math.min(b.playerHP, dmg)
    b.playerHP = Math.max(0, b.playerHP - dmg)
    b.phase = 'player'
    sfx.hit()
    pushMsg(`Wild ${b.enemy.name} used ${mv.name} ${mv.emoji}! (-${actual} HP)`)
    if (b.playerHP <= 0) {
      b.playerHP = 100
      endBattle('lost', ['Your systems crashed... REBOOTED!'])
    }
  }

  function battleAction(action) {
    if (!battle || !battle.active || battle.phase !== 'player') return
    const b = battle

    switch (action) {
      case 'ping': {
        let dmg = Math.round(rand(10, 16))
        const crit = Math.random() < 0.12
        if (crit) dmg = Math.round(dmg * 1.6)
        b.enemyHP = Math.max(0, b.enemyHP - dmg)
        sfx.attack()
        pushMsg(`You used PING ⚡! (-${dmg} HP)${crit ? ' CRITICAL HIT!' : ''}`)
        if (b.enemyHP <= 0) {
          endBattle('fainted', [`${b.enemy.name} crashed out! No catch for you.`])
          return
        }
        enemyAttack()
        return
      }
      case 'diagnose': {
        b.diagnosed = true
        sfx.heal()
        pushMsg('You ran DIAGNOSE 🔍! Capture chance increased!')
        enemyAttack()
        return
      }
      case 'fix': {
        const healed = Math.min(20, 100 - b.playerHP)
        b.playerHP += healed
        const dmg = Math.round(rand(4, 8))
        b.enemyHP = Math.max(0, b.enemyHP - dmg)
        sfx.heal()
        pushMsg(`You ran FIX 🛠️! (+${healed} HP, -${dmg} on enemy)`)
        if (b.enemyHP <= 0) {
          endBattle('fainted', [`${b.enemy.name} crashed out! No catch for you.`])
          return
        }
        enemyAttack()
        return
      }
      case 'capture': {
        const hpPct = b.enemyHP / b.enemyMax
        let chance = b.enemy.catchRate + (1 - hpPct) * 0.35 + (b.diagnosed ? 0.15 : 0)
        chance = Math.min(0.95, chance)
        sfx.capture()
        if (Math.random() < chance) {
          pushMsg(`You threw the PATCH DISK 💾... Gotcha! ${b.enemy.name} was caught!`)
          sfx.caught()
          endBattle('caught', [`${b.enemy.name} was added to your Bugdex!`])
          return
        }
        pushMsg('It wiggled free! Damage it more or use DIAGNOSE. 💾')
        enemyAttack()
        return
      }
      case 'run': {
        sfx.capture()
        endBattle('fled', ['You escaped safely. 💨'])
        return
      }
      default:
        return
    }
  }

  /* ---------- Rendering ---------- */

  function drawTiles() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tile = MAP[r][c]
        const x = c * TILE
        const y = r * TILE
        ctx.fillStyle = TILE_COLORS[tile]
        ctx.fillRect(x, y, TILE, TILE)

        if (tile === 2) {
          ctx.font = '22px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🌳', x + TILE / 2, y + TILE / 2 + 2)
        } else if (tile === 3) {
          ctx.strokeStyle = 'rgba(255,255,255,0.5)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(x + 4, y + 14)
          ctx.quadraticCurveTo(x + 10, y + 8, x + 16, y + 14)
          ctx.quadraticCurveTo(x + 22, y + 20, x + 28, y + 14)
          ctx.stroke()
        } else if (tile === 4) {
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🌼', x + TILE / 2, y + TILE / 2)
        } else if (tile === 5) {
          ctx.font = '20px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('🖥️', x + TILE / 2, y + TILE / 2)
        } else if (tile === 1) {
          ctx.fillStyle = 'rgba(0,0,0,0.08)'
          for (let i = 0; i < 3; i++) {
            const gx = x + 6 + i * 9
            ctx.fillRect(gx, y + 6 + (i % 2) * 6, 2, 4)
          }
        }
      }
    }
  }

  function drawPlayer() {
    const bob = player.moving ? Math.abs(Math.sin(time * 18)) * 3 : Math.sin(time * 4) * 1.5
    const x = player.px
    const y = player.py
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.beginPath()
    ctx.ellipse(x, y + 12, 9, 3.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '30px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🧑‍💻', x, y - 2 + bob)
  }

  function draw() {
    ctx.clearRect(0, 0, VIEW_W, VIEW_H)
    drawTiles()
    drawPlayer()
  }

  /* ---------- Loop ---------- */

  function loop(now) {
    if (destroyed) return
    if (!last) last = now
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    time += dt
    if (state === 'running') update(dt)
    draw()
    raf = requestAnimationFrame(loop)
  }

  function stopLoop() {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    }
  }

  function resumeLoop() {
    if (!raf && !destroyed) raf = requestAnimationFrame(loop)
  }

  return {
    start() {
      state = 'running'
      if (!raf) raf = requestAnimationFrame(loop)
    },
    resetPlayer() {
      held.clear()
      player.c = PLAYER_START.c
      player.r = PLAYER_START.r
      player.px = PLAYER_START.c * TILE + TILE / 2
      player.py = PLAYER_START.r * TILE + TILE / 2
      player.moving = false
    },
    move(dir) {
      held.add(dir)
      moveWith()
    },
    releaseKey(dir) {
      held.delete(dir)
    },
    get state() {
      return battle ? 'battle' : 'overworld'
    },
    battleAction,
    getBattle() {
      return battleSnapshot()
    },
    destroy() {
      destroyed = true
      stopLoop()
      held.clear()
    },
  }
}