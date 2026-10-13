import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { Reveal } from '../components/ui'
import { MODEL_URL } from '../data/showcase'

const webglOK = () => {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('nowebgl')) return false   // dev-only: preview the fallback
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

/** One black VYRO headphone as a real 3D model — drag / swipe to turn it, slow idle rotation. */
export default function Showcase() {
  const rm = useReducedMotion()
  const wrap = useRef(null), host = useRef(null)
  const [status, setStatus] = useState('idle')       // idle | loading | ready | fallback
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    let api = null, disposed = false, started = false
    const boot = async () => {
      setStatus('loading')
      if (!webglOK()) { setStatus('fallback'); return }
      try {
        const mod = await import('../lib/headphone3d')            // Three.js loads only when the section is near
        if (disposed) return
        api = await mod.createViewer({
          container: host.current, reduced: !!rm && !(import.meta.env.DEV && new URLSearchParams(window.location.search).has('motion')), modelUrl: MODEL_URL,
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
    return () => { disposed = true; io.disconnect(); api && api.dispose() }
  }, [rm])

  return (
    <section id="showcase" ref={wrap} aria-labelledby="showcase-h" className="showroom on-yellow relative overflow-hidden text-ink">
      <div className="relative md:min-h-[112svh] pb-10 md:pb-0">
        <div className="relative z-10 px-5 md:px-[5.3vw] pt-28 md:pt-48 md:max-w-[30vw]">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>01</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="showcase-h" delay={0.05} className="h-sec !text-[clamp(1.7rem,3vw,3rem)]">Premium wireless headphones</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-[20rem] font-medium leading-relaxed text-[.95rem]">A closer look from every angle. Drag or swipe to turn it all the way round.</Reveal>
        </div>

        <div className="relative mt-6 h-[78svh] min-h-[420px] md:mt-0 md:absolute md:inset-y-[5svh] md:right-0 md:w-[78%] md:h-auto"
          role="group" aria-label="Interactive 3D model of the black VYRO over-ear headphone. Drag, swipe or use the arrow keys to rotate it.">
          {/* WebGL canvas is mounted here */}
          <div ref={host} className="absolute inset-0" />

          {/* still image: shown while the 3D scene loads, and as the fallback when WebGL is unavailable */}
          <img src="/img/headphone-poster.webp" width={1400} height={933} alt={status === 'fallback' ? 'A black VYRO over-ear wireless headphone on a yellow and black set' : ''}
            aria-hidden={status !== 'fallback'} loading="lazy" decoding="async"
            className={`poster-fade absolute inset-0 w-full h-full object-cover md:object-contain pointer-events-none transition-opacity duration-700 ${status === 'ready' ? 'opacity-0' : 'opacity-100'}`} />

          <div className={`pointer-events-none absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 ${status === 'ready' && !touched ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
            <span className="inline-flex items-center gap-3 bg-ink/80 text-warm backdrop-blur px-5 py-3 rounded-full eyebrow text-[.62rem]">
              <MoveHorizontal size={16} /> Drag to rotate · 360°
            </span>
          </div>
          {status === 'fallback' && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-ink/80 text-warm px-4 py-2 rounded-full text-xs">Interactive 3D isn’t available on this device.</p>
          )}
        </div>
      </div>
    </section>
  )
}
