import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { Reveal } from '../components/ui'

const CUTOUT = '/img/headphone-cutout.webp'      // still of the photographed headphone — loading placeholder and no-WebGL fallback only
const MODEL_URL = null                           // set to '/models/vyro-headphone.glb' to use a designed GLB instead of the built-in model

const webglOK = () => {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('nowebgl')) return false   // dev-only: preview the fallback
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

/** One black VYRO headphone as a genuine real-time 3D model — drag / swipe to turn it through a full 360°, slow idle rotation. */
export default function Showcase() {
  const rm = useReducedMotion()
  const wrap = useRef(null), host = useRef(null), floor = useRef(null)
  const [status, setStatus] = useState('idle')       // idle | loading | ready | fallback
  const [touched, setTouched] = useState(false)
  const [base, setBase] = useState(0.78)             // where the floor line falls inside the 3D canvas (fraction of its height)

  useEffect(() => {
    let api = null, disposed = false, started = false
    const baseFrac = () => {
      const h = host.current.getBoundingClientRect(), f = floor.current.getBoundingClientRect()
      return Math.max(0.4, Math.min(0.95, (f.top - h.top) / h.height))
    }
    const syncBase = () => setBase(baseFrac())
    syncBase()
    const ro = new ResizeObserver(syncBase); ro.observe(host.current)

    const boot = async () => {
      setStatus('loading')
      if (!webglOK()) { setStatus('fallback'); return }
      try {
        const mod = await import('../lib/headphone3d')            // Three.js loads only when the section is near
        if (disposed) return
        api = await mod.createViewer({
          container: host.current, reduced: !!rm && !(import.meta.env.DEV && new URLSearchParams(window.location.search).has('motion')),
          modelUrl: MODEL_URL, getBaseFrac: baseFrac,
          onInteract: () => setTouched(true), onReady: () => setStatus('ready'), onLost: () => setStatus('fallback'),
        })
        if (disposed) api.dispose()
      } catch (err) {
        console.warn('3D viewer unavailable, showing the still image instead.', err)
        setStatus('fallback')
      }
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; boot() }
      api && api.setVisible(e.isIntersecting)
    }, { rootMargin: '300px' })
    io.observe(wrap.current)
    return () => { disposed = true; io.disconnect(); ro.disconnect(); api && api.dispose() }
  }, [rm])

  return (
    <section id="showcase" ref={wrap} aria-labelledby="showcase-h" className="showroom on-yellow relative overflow-hidden text-ink">
      <div className="relative md:min-h-[120svh]">
        <div className="relative z-10 px-5 md:px-[5.3vw] pt-28 md:pt-48 md:max-w-[30vw]">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>01</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="showcase-h" delay={0.05} className="h-sec !text-[clamp(1.7rem,3vw,3rem)]">Premium wireless headphones</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-[20rem] font-medium leading-relaxed text-[.95rem]">A closer look from every angle. Drag or swipe to turn it all the way round.</Reveal>
        </div>

        <div className="relative mt-4 h-[84svh] min-h-[460px] overflow-hidden md:mt-0 md:absolute md:inset-0 md:h-auto md:min-h-0">
          <div ref={floor} className="showroom-floor absolute inset-x-0 bottom-0 h-[24%] md:h-[26%]" />

          {/* WebGL canvas is mounted here. Role/label describe the 3D model for assistive tech. */}
          <div ref={host} role="group" aria-label="Interactive 3D model of the black VYRO over-ear headphone. Drag, swipe or use the arrow keys to rotate it through 360 degrees."
            className="absolute inset-x-0 top-[2%] bottom-[5%] md:inset-x-auto md:right-0 md:w-[78%] md:top-[4%] md:bottom-[6%]" />

          {/* soft fade so the floor reflection dissolves into the table */}
          <div className="reflection-fade pointer-events-none absolute inset-x-0 bottom-0 h-[18%] md:h-[17%]" aria-hidden="true" />

          {/* still image: placeholder while the 3D scene loads, and the fallback when WebGL is unavailable */}
          <img src={CUTOUT} width={681} height={805} alt={status === 'fallback' ? 'The black VYRO over-ear wireless headphone on a yellow and black set' : ''} aria-hidden={status !== 'fallback'}
            loading="lazy" decoding="async" draggable={false}
            className={`absolute left-1/2 md:left-[61%] -translate-x-1/2 h-[min(60%,calc(88vw*1.182))] w-auto pointer-events-none transition-opacity duration-700 ${status === 'ready' ? 'opacity-0' : 'opacity-100'}`}
            style={{ bottom: `${(1 - base) * 100 * 0.94 + 5}%` }} />

          <div className={`pointer-events-none absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 ${status === 'ready' && !touched ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
            <span className="inline-flex items-center gap-3 whitespace-nowrap bg-ink/80 text-warm backdrop-blur px-5 py-3 rounded-full eyebrow text-[.62rem]">
              <MoveHorizontal size={16} /> Drag to rotate · 360°
            </span>
          </div>
          {status === 'fallback' && (
            <p className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 z-10 bg-ink/80 text-warm px-4 py-2 rounded-full text-xs whitespace-nowrap">Interactive 3D isn’t available on this device.</p>
          )}
        </div>
      </div>
    </section>
  )
}
