import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { Reveal } from '../components/ui'

const CUTOUT = '/img/headphone-cutout.webp'      // the real headphone from the product photograph, cut out from its backdrop
const AMPLITUDE = 26        // degrees either side of the front view during the slow idle turn
const PERIOD = 15           // seconds for one full sweep
const LIMIT = 58            // furthest the visitor can turn it by hand (a single photograph has no back side to show)

/** The photographed VYRO headphone, turning slowly. Drag / swipe to turn it by hand; it eases back and carries on. */
export default function Showcase() {
  const rm = useReducedMotion()
  const wrap = useRef(null), stage = useRef(null), turn = useRef(null), sheen = useRef(null)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const el = stage.current, spin = turn.current, glint = sheen.current
    let raf = 0, visible = false, last = performance.now()
    let yawUser = 0, vel = 0, phase = 0, autoK = 0, idle = 0, dragging = false, lastX = 0, lastT = 0, told = false
    const reduced = !!rm && !(import.meta.env.DEV && new URLSearchParams(window.location.search).has('motion'))   // ?motion = dev-only QA switch

    const currentYaw = () => yawUser + AMPLITUDE * autoK * Math.sin(phase)
    const apply = () => {
      const yaw = currentYaw()
      spin.style.transform = `rotateY(${yaw.toFixed(2)}deg) rotateX(${(-Math.abs(yaw) * 0.04).toFixed(2)}deg)`
      glint.style.backgroundPosition = `${(50 - yaw * 1.9).toFixed(1)}% 0`
    }
    const step = (dt) => {
      if (dragging) { idle = 0; autoK = Math.max(0, autoK - dt * 4); return }
      yawUser = Math.max(-LIMIT, Math.min(LIMIT, yawUser + vel * dt)); vel *= Math.pow(0.03, dt)       // inertia
      idle += dt
      if (idle > 1.4) yawUser *= Math.exp(-dt * 0.9)                                                  // drift back to the idle sweep
      if (!reduced && idle > 1.6) { autoK = Math.min(1, autoK + dt * 0.45); phase += (autoK * dt * Math.PI * 2) / PERIOD }
    }
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      step(dt); apply()
      if (visible) raf = requestAnimationFrame(tick)
    }
    const run = (v) => { visible = v && !document.hidden; cancelAnimationFrame(raf); if (visible) { last = performance.now(); raf = requestAnimationFrame(tick) } }

    const down = (e) => {
      dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0
      yawUser = currentYaw(); autoK = 0; idle = 0                       // fold the idle sweep into the hand position so nothing jumps
      el.style.cursor = 'grabbing'; try { el.setPointerCapture(e.pointerId) } catch {}
    }
    const move = (e) => {
      if (!dragging) return
      const now = performance.now(), dt = Math.max(1, now - lastT) / 1000, dx = e.clientX - lastX
      const d = dx * 0.22
      yawUser = Math.max(-LIMIT, Math.min(LIMIT, yawUser + d)); vel = vel * 0.6 + (d / dt) * 0.4
      lastX = e.clientX; lastT = now
      if (!told) { told = true; setTouched(true) }
    }
    const up = (e) => { dragging = false; el.style.cursor = 'grab'; vel = Math.max(-140, Math.min(140, vel)); try { el.releasePointerCapture(e.pointerId) } catch {} }
    const key = (e) => {
      const d = { ArrowLeft: -12, ArrowRight: 12 }[e.key]
      if (!d) return
      e.preventDefault(); yawUser = Math.max(-LIMIT, Math.min(LIMIT, currentYaw() + d)); autoK = 0; idle = 0
      if (!told) { told = true; setTouched(true) }
    }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('keydown', key)
    const io = new IntersectionObserver(([e]) => run(e.isIntersecting), { rootMargin: '120px' })
    io.observe(wrap.current)
    const onVis = () => run(visible || !document.hidden)
    document.addEventListener('visibilitychange', onVis)
    apply()
    if (import.meta.env.DEV) window.__spin = { get yaw() { return currentYaw() }, get autoK() { return autoK }, get dragging() { return dragging }, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) step(1 / 60); apply() } }

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', onVis)
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('keydown', key)
    }
  }, [rm])

  return (
    <section id="showcase" ref={wrap} aria-labelledby="showcase-h" className="showroom on-yellow relative overflow-hidden text-ink">
      <div className="relative md:min-h-[120svh] pb-0">
        <div className="relative z-10 px-5 md:px-[5.3vw] pt-28 md:pt-48 md:max-w-[30vw]">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>01</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="showcase-h" delay={0.05} className="h-sec !text-[clamp(1.7rem,3vw,3rem)]">Premium wireless headphones</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-[20rem] font-medium leading-relaxed text-[.95rem]">A closer look at the VYRO headphone. Drag or swipe to turn it.</Reveal>
        </div>

        <div className="relative mt-4 h-[84svh] min-h-[460px] overflow-hidden md:mt-0 md:absolute md:inset-0 md:h-auto md:min-h-0">
          <div className="showroom-floor absolute inset-x-0 bottom-0 h-[24%] md:h-[26%]" />

          <div ref={stage} tabIndex={0} role="group" aria-label="The black VYRO over-ear headphone. Drag, swipe or use the left and right arrow keys to turn it."
            className="absolute inset-x-0 top-[3%] bottom-[22%] md:inset-x-auto md:right-0 md:w-[78%] md:top-[11%] md:bottom-[24%] flex items-end justify-center cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-ink select-none"
            style={{ perspective: '1700px', touchAction: 'pan-y' }}>
            <div className="absolute bottom-[-1.5%] left-1/2 -translate-x-1/2 w-[62%] h-[7%] rounded-[50%] bg-black/70 blur-xl pointer-events-none" aria-hidden="true" />
            <div ref={turn} className="relative h-[min(100%,calc(90vw*1.182))] will-change-transform" style={{ aspectRatio: '681 / 805', transformOrigin: '50% 100%' }}>
              <img src={CUTOUT} width={681} height={805} alt="The black VYRO over-ear wireless headphone with soft cushioned ear pads, shown against a yellow and black set"
                decoding="async" draggable={false} className="absolute inset-0 w-full h-full pointer-events-none" />
              <div ref={sheen} className="headphone-sheen absolute inset-0 pointer-events-none" aria-hidden="true" style={{ maskImage: `url(${CUTOUT})`, WebkitMaskImage: `url(${CUTOUT})` }} />
              <img src={CUTOUT} alt="" aria-hidden="true" draggable={false} className="headphone-reflection absolute left-0 top-full w-full h-full pointer-events-none" />
            </div>
          </div>

          <div className={`pointer-events-none absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 ${touched ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
            <span className="inline-flex items-center gap-3 bg-ink/80 text-warm backdrop-blur px-5 py-3 rounded-full eyebrow text-[.62rem]">
              <MoveHorizontal size={16} /> Drag to turn
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
