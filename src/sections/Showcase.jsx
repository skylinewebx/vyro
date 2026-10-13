import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURES, PLATE } from '../data/showcase'

gsap.registerPlugin(ScrollTrigger)

const PW = PLATE.w + 2 * PLATE.padX
const U = (x) => (x + PLATE.padX) / PW
const V = (y) => (y - PLATE.top) / PLATE.h
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const ALT = 'A white VYRO over-ear wireless headphone with soft cushioned ear pads, an adjustable headband and controls on the ear cup, on a yellow and black studio set'
const N = FEATURES.length
const T0 = 0.06            // intro hold (scroll progress)
const SEG = 0.12           // progress per feature
const pad = (n) => String(n).padStart(2, '0')

export default function Showcase() {
  const rm = useReducedMotion()
  // dev-only QA switch (?motion) so the cinematic path can be tested in a reduced-motion browser
  const forced = import.meta.env.DEV && new URLSearchParams(window.location.search).has('motion')
  return rm && !forced ? <StaticShowcase /> : <CinematicShowcase />
}

/* ------------------------------------------------------------------ cinematic (scroll-driven) */
function CinematicShowcase() {
  const wrap = useRef(null), stage = useRef(null), plate = useRef(null)
  const introEl = useRef(null), outroEl = useRef(null)
  const labels = useRef([]), inner = useRef([]), paths = useRef([]), dots = useRef([]), rings = useRef([])
  const nav = useRef({ go: () => {} })
  const [active, setActive] = useState(-1)

  useLayoutEffect(() => {
    const S = { W: 0, H: 0, mobile: false, bw: 0, bh: 0, unit: 0, cams: [], rects: [] }
    const OVERVIEW = { s: 1, fu: 0.5, fv: 1, sx: 0.5, sy: 1 }          // whole product, floor on the bottom edge
    const cam = { ...OVERVIEW }
    const draws = FEATURES.map(() => ({ d: 0 }))
    let tl = null, lastW = 0, lastH = 0, lastActive = -2

    const measure = () => {
      const el = stage.current
      S.W = el.clientWidth; S.H = el.clientHeight
      S.mobile = S.W < 768
      S.bh = S.mobile ? S.W * 1.2 : Math.min(S.H * 0.94, S.W * 0.95)
      S.bw = (S.bh * PW) / PLATE.h
      S.unit = S.bh / PLATE.h
      const dmin = S.mobile ? S.W * 0.92 : S.H
      S.cams = FEATURES.map((f) => ({
        s: clamp(((S.mobile ? 0.9 : 0.64) * dmin) / (f.size * S.unit), 1.35, S.mobile ? 4.4 : 3.5),
        fu: U(f.focus[0]), fv: V(f.focus[1]),
        sx: S.mobile ? 0.5 : f.side === 'R' ? 0.34 : 0.66,
        sy: S.mobile ? 0.33 : 0.54,
      }))
      plate.current.style.width = `${S.bw}px`
      plate.current.style.height = `${S.bh}px`
      el.style.setProperty('--floor', `${S.H - S.bh * 0.13}px`)
      const sb = el.getBoundingClientRect()
      S.rects = labels.current.map((l) => { const b = l.getBoundingClientRect(); return { l: b.left - sb.left, r: b.right - sb.left, t: b.top - sb.top } })
    }

    const render = () => {
      const { W, H, bw, bh } = S
      const Tx = cam.sx * W - cam.fu * bw * cam.s
      const Ty = cam.sy * H - cam.fv * bh * cam.s
      plate.current.style.transform = `translate3d(${Tx.toFixed(2)}px,${Ty.toFixed(2)}px,0) scale(${cam.s.toFixed(4)})`
      FEATURES.forEach((f, i) => {
        const p = paths.current[i], dot = dots.current[i], ring = rings.current[i]
        const d = draws[i].d
        if (d < 0.002) { p.style.opacity = 0; dot.style.opacity = 0; ring.style.visibility = 'hidden'; return }
        const ax = Tx + U(f.anchor[0]) * bw * cam.s
        const ay = Ty + V(f.anchor[1]) * bh * cam.s
        const r = S.rects[i]
        let path
        if (S.mobile) {
          path = `M${ax.toFixed(1)} ${ay.toFixed(1)} L${ax.toFixed(1)} ${(r.t - 10).toFixed(1)}`
        } else {
          const left = f.side === 'L'
          const px = left ? r.r + 14 : r.l - 14
          const py = r.t + 30
          const ex = left ? px + 90 : px - 90
          path = `M${ax.toFixed(1)} ${ay.toFixed(1)} L${ex.toFixed(1)} ${py.toFixed(1)} L${px.toFixed(1)} ${py.toFixed(1)}`
        }
        p.setAttribute('d', path)
        p.style.strokeDashoffset = (1 - d).toFixed(4)
        p.style.opacity = 1
        const o = Math.min(1, d * 4).toFixed(3)
        dot.setAttribute('cx', ax.toFixed(1)); dot.setAttribute('cy', ay.toFixed(1)); dot.style.opacity = o
        ring.setAttribute('cx', ax.toFixed(1)); ring.setAttribute('cy', ay.toFixed(1)); ring.style.visibility = 'visible'
      })
    }

    const build = (progress = 0) => {
      tl && (tl.scrollTrigger && tl.scrollTrigger.kill(), tl.kill())
      Object.assign(cam, OVERVIEW)
      draws.forEach((x) => (x.d = 0))
      gsap.set(inner.current, { autoAlpha: 0, y: 18 })
      gsap.set(introEl.current, { autoAlpha: 1, y: 0 })
      gsap.set(outroEl.current, { autoAlpha: 0, y: 20 })

      tl = gsap.timeline({
        defaults: { immediateRender: false },
        scrollTrigger: {
          trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 0.7,
          onUpdate: (self) => {
            const p = self.progress
            const a = p < T0 + 0.02 ? -1 : p > T0 + N * SEG - 0.01 ? N : Math.floor((p - T0) / SEG)
            const clamped = clamp(a, -1, N)
            if (clamped !== lastActive) { lastActive = clamped; setActive(clamped) }
          },
        },
      })
      tl.fromTo(introEl.current, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -22, duration: 0.03, ease: 'power1.in' }, 0.035)
      FEATURES.forEach((f, i) => {
        const t = T0 + i * SEG
        const from = i === 0 ? OVERVIEW : S.cams[i - 1]
        tl.fromTo(cam, { ...from }, { ...S.cams[i], duration: 0.045, ease: 'power2.inOut' }, t)
        tl.fromTo(draws[i], { d: 0 }, { d: 1, duration: 0.03, ease: 'power1.out' }, t + 0.04)
        tl.fromTo(inner.current[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.03, ease: 'power2.out' }, t + 0.05)
        tl.fromTo(inner.current[i], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 0.022, ease: 'power1.in' }, t + SEG - 0.026)
        tl.fromTo(draws[i], { d: 1 }, { d: 0, duration: 0.02, ease: 'power1.in' }, t + SEG - 0.026)
      })
      tl.fromTo(cam, { ...S.cams[N - 1] }, { ...OVERVIEW, duration: 0.07, ease: 'power2.inOut' }, T0 + N * SEG - 0.004)
      tl.fromTo(outroEl.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.955)
      tl.to({}, { duration: 0 }, 1)
      tl.eventCallback('onUpdate', render)
      render()
      if (progress) tl.progress(progress)
    }

    measure(); lastW = S.W; lastH = S.H
    build()
    if (import.meta.env.DEV) window.__sc = { cam, draws, S, get tl() { return tl } }

    nav.current.go = (i) => {
      const st = tl && tl.scrollTrigger
      if (!st) return
      const p = T0 + i * SEG + 0.075
      const y = st.start + p * (st.end - st.start)
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.5 }) : window.scrollTo({ top: y, behavior: 'smooth' })
    }

    const ro = new ResizeObserver(() => {
      const w = stage.current.clientWidth, h = stage.current.clientHeight
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 90) return
      lastW = w; lastH = h
      const prog = tl ? tl.progress() : 0
      measure(); build(prog)
    })
    ro.observe(stage.current)

    return () => { ro.disconnect(); tl && (tl.scrollTrigger && tl.scrollTrigger.kill(), tl.kill()) }
  }, [])

  return (
    <section id="showcase" ref={wrap} aria-labelledby="showcase-h" className="relative h-[560vh] md:h-[620vh] bg-ink">
      <div ref={stage} className="stage on-yellow sticky top-0 h-[100svh] overflow-hidden text-ink">
        {/* product plate — camera moves by transforming this element */}
        <div ref={plate} className="plate-mask absolute left-0 top-0 origin-top-left" style={{ width: '100vw', height: '45vw' }}>
          <picture>
            <source media="(max-width: 767px)" srcSet="/img/showcase-m.webp" />
            <img src="/img/showcase.webp" width={3625} height={1616} alt={ALT} decoding="async" draggable={false} className="block w-full h-full select-none" />
          </picture>
        </div>

        {/* annotation lines (screen space, driven by the same camera) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
          {FEATURES.map((f, i) => (
            <g key={f.id}>
              <path ref={(el) => (paths.current[i] = el)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="#080808" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="callout-line" style={{ opacity: 0 }} />
              <circle ref={(el) => (rings.current[i] = el)} r="6" fill="none" stroke="#080808" strokeWidth="1.2" className="callout-ring" style={{ visibility: 'hidden' }} />
              <circle ref={(el) => (dots.current[i] = el)} r="5" fill="#080808" stroke="#fff" strokeWidth="1.5" style={{ opacity: 0 }} />
            </g>
          ))}
        </svg>

        {/* intro / outro copy */}
        <div ref={introEl} className="absolute z-20 left-5 right-5 top-[132px] md:left-[5.3vw] md:right-auto md:top-[19%] md:max-w-[24vw]">
          <p className="eyebrow flex items-center gap-4 mb-4"><span>01</span><span className="tick" /></p>
          <h2 id="showcase-h" className="h-sec !text-[clamp(1.5rem,2.3vw,2.4rem)]">Premium wireless headphones</h2>
          <p className="mt-4 text-[.9rem] font-medium leading-relaxed max-w-[19rem]">Soft-touch cushions, tactile controls and a clean white finish. Scroll to explore the details.</p>
          <span className="mt-6 inline-flex items-center gap-3 eyebrow text-[.6rem]"><span className="relative w-px h-9 bg-ink/30 overflow-hidden"><span className="absolute inset-x-0 top-0 h-1/2 bg-ink animate-[scrollcue_1.8s_ease-in-out_infinite]" /></span>Scroll</span>
        </div>
        <div ref={outroEl} className="absolute z-20 left-5 right-5 top-[132px] md:left-[5.3vw] md:right-auto md:top-[19%] md:max-w-[24vw]" style={{ visibility: 'hidden' }}>
          <p className="eyebrow mb-4">VYRO</p>
          <p className="h-sec !text-[clamp(1.5rem,2.3vw,2.4rem)]">Feel every frequency.</p>
          <Link to="/shop" className="btn btn-dark mt-6">Shop the collection →</Link>
        </div>

        {/* feature description cards */}
        {FEATURES.map((f, i) => (
          <div key={f.id} ref={(el) => (labels.current[i] = el)}
            className={`absolute z-20 pointer-events-none left-4 right-4 bottom-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[min(330px,27vw)] ${f.side === 'L' ? 'md:left-[5vw] md:right-auto' : 'md:right-[5vw] md:left-auto'}`}>
            <div ref={(el) => (inner.current[i] = el)} className="bg-ink/92 text-warm backdrop-blur-sm border-l-2 border-vy p-4 md:p-6 invisible">
              <p className="eyebrow text-vy text-[.6rem]">{pad(i + 1)} / {pad(N)}</p>
              <h3 className="font-display text-[.95rem] md:text-[1.02rem] mt-2 tracking-[-0.01em]">{f.title}</h3>
              <p className="text-[.82rem] md:text-[.86rem] opacity-80 mt-2 leading-relaxed">{f.body}</p>
            </div>
          </div>
        ))}

        {/* feature index — also a way to jump between details */}
        <nav aria-label="Headphone details" className="absolute z-30 top-[78px] left-1/2 -translate-x-1/2 md:top-auto md:bottom-6 flex items-center gap-1.5 bg-ink/75 backdrop-blur px-2.5 py-2 rounded-full">
          {FEATURES.map((f, i) => (
            <button key={f.id} onClick={() => nav.current.go(i)} aria-label={`Show: ${f.title}`} aria-current={active === i ? 'true' : undefined}
              className={`h-7 min-w-7 px-1 rounded-full text-[.62rem] font-semibold tracking-wider transition-colors duration-300 ${active === i ? 'bg-vy text-ink' : 'text-warm/70 hover:text-vy'}`}>
              {pad(i + 1)}
            </button>
          ))}
        </nav>

        <ul className="sr-only">
          {FEATURES.map((f) => <li key={f.id}><strong>{f.title}.</strong> {f.body}</li>)}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ reduced-motion alternative */
function StaticShowcase() {
  return (
    <section id="showcase" aria-labelledby="showcase-h" className="stage-static on-yellow text-ink px-5 md:px-[5.3vw] pt-24 pb-20 md:pt-28">
      <p className="eyebrow flex items-center gap-4 mb-4"><span>01</span><span className="tick" /></p>
      <h2 id="showcase-h" className="h-sec !text-[clamp(1.6rem,3.4vw,3rem)]">Premium wireless headphones</h2>
      <p className="mt-4 text-[.95rem] font-medium leading-relaxed max-w-md">Soft-touch cushions, tactile controls and a clean white finish.</p>
      <div className="relative mt-10 mx-auto max-w-6xl overflow-hidden">
        <picture>
          <source media="(max-width: 767px)" srcSet="/img/showcase-m.webp" />
          <img src="/img/showcase.webp" width={3625} height={1616} alt={ALT} loading="lazy" decoding="async" className="block w-full h-auto" />
        </picture>
        {FEATURES.map((f, i) => (
          <span key={f.id} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink text-warm text-[.6rem] font-semibold grid place-items-center ring-2 ring-white/70"
            style={{ left: `${U(f.marker[0]) * 100}%`, top: `${V(f.marker[1]) * 100}%` }}>{i + 1}</span>
        ))}
      </div>
      <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 max-w-5xl mx-auto">
        {FEATURES.map((f, i) => (
          <li key={f.id} className="border-t border-ink/40 pt-4">
            <p className="eyebrow text-[.6rem]">{pad(i + 1)} / {pad(N)}</p>
            <h3 className="font-display text-[.95rem] mt-2">{f.title}</h3>
            <p className="text-[.86rem] mt-2 leading-relaxed">{f.body}</p>
          </li>
        ))}
      </ol>
      <div className="max-w-5xl mx-auto mt-12"><Link to="/shop" className="btn btn-dark">Shop the collection →</Link></div>
    </section>
  )
}
