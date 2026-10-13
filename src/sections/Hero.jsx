import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { EASE } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

const Line = ({ children, delay }) => {
  const rm = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[.08em]">
      <motion.span className="block" initial={rm ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay }}>{children}</motion.span>
    </span>
  )
}

export default function Hero() {
  const rm = useReducedMotion()
  const img = useRef(null)
  const sec = useRef(null)

  useEffect(() => {
    if (rm) return
    const ctx = gsap.context(() => {
      gsap.to(img.current, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: sec.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, sec)
    return () => ctx.revert()
  }, [rm])

  const fade = (d) => ({ initial: rm ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } })
  const scrollDown = () => {
    const el = document.getElementById('featured')
    if (!el) return
    window.__lenis ? window.__lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sec} className="relative min-h-[100svh] bg-vy text-ink overflow-hidden on-yellow">
      {/* Single hero photograph — model on the right, type on the left */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[58%] md:inset-y-auto md:bottom-0 md:left-auto md:right-0 md:h-[89%] md:w-[68%] hero-mask"
        initial={rm ? false : { clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} transition={{ duration: 1.5, ease: EASE, delay: 0.1 }}>
        <div ref={img} className="w-full h-full will-change-transform" style={{ transform: 'scale(1.08)' }}>
          <motion.img src="/img/hero.webp" alt="A woman in black over-ear headphones and a dark sweatshirt against a vivid yellow backdrop"
            fetchPriority="high" className="w-full h-full object-cover object-[60%_22%] md:object-[56%_18%]"
            initial={rm ? false : { scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE }} />
        </div>
      </motion.div>

      <div className="relative z-10 min-h-[100svh] px-5 md:px-10 pt-24 md:pt-0 flex flex-col md:justify-center">
        <motion.p {...fade(0.5)} className="eyebrow leading-[1.9] mb-5 md:mb-10 md:absolute md:top-[26%] md:left-10 hidden sm:block">
          Premium Audio<br />For a Higher<br />Tomorrow
          <span className="block w-9 h-px bg-ink mt-4" />
        </motion.p>
        <h1 className="h-hero md:mt-20">
          <Line delay={0.35}>Feel every</Line>
          <Line delay={0.5}>Frequency.</Line>
        </h1>
        <motion.p {...fade(0.9)} className="mt-5 md:mt-8 max-w-[19rem] md:max-w-sm text-[.9rem] md:text-[.95rem] leading-[1.7] font-medium text-ink/85">
          Immersive sound. Unmatched comfort. Designed for the dreamers, the doers, and everyone in between.
        </motion.p>
        <motion.div {...fade(1.05)} className="mt-6 md:mt-9">
          <Link to="/shop" className="btn btn-dark">Explore collection <ArrowRight size={16} /></Link>
        </motion.div>
      </div>

      <motion.p {...fade(1.3)} className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 vertical eyebrow z-10 pointer-events-none">
        Headphones &nbsp;/&nbsp; Earbuds
      </motion.p>
      <motion.button {...fade(1.4)} onClick={scrollDown} aria-label="Scroll to the featured collection"
        className="absolute left-5 md:left-10 bottom-6 md:bottom-8 z-10 hidden sm:flex items-center gap-4 eyebrow text-[.6rem]">
        <span className="relative w-px h-10 bg-ink/30 overflow-hidden"><span className="absolute inset-x-0 top-0 h-1/2 bg-ink animate-[scrollcue_1.8s_ease-in-out_infinite]" /></span>Scroll
      </motion.button>
    </section>
  )
}
