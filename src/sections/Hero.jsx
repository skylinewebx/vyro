import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE } from '../components/ui'

const Line = ({ children, delay, tm }) => {
  const rm = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[.1em] -mb-[.1em]">
      <motion.span className="block" initial={rm ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay }}>
        {children}{tm && <sup className="text-[.16em] align-super ml-[.25em] tracking-normal font-sans">™</sup>}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const rm = useReducedMotion()
  const fade = (d) => ({ initial: rm ? false : { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay: d } })
  const scrollDown = () => {
    const el = document.getElementById('showcase')
    if (!el) return
    window.__lenis ? window.__lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero-bg relative min-h-[100svh] text-ink overflow-hidden on-yellow">
      {/* The single hero photograph — model on the right, type on the left */}
      <motion.img
        src="/img/hero.webp" width={1480} height={1718}
        alt="A woman with her eyes closed, wearing glasses, a black turtleneck and black VYRO over-ear headphones, against a vivid yellow backdrop"
        fetchPriority="high" decoding="async"
        className="hero-photo absolute bottom-0 right-0 w-[104vw] max-w-none h-auto md:w-auto md:h-[min(91svh,56vw)] md:right-[7vw]"
        initial={rm ? false : { opacity: 0, x: 28, scale: 1.03 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1.5, ease: EASE, delay: 0.1 }}
      />

      <div className="relative z-10 min-h-[100svh] px-5 md:px-[5.3vw] pt-24 md:pt-0 flex flex-col md:justify-center">
        <motion.p {...fade(0.5)} className="hidden sm:block eyebrow font-medium leading-[2.1] md:absolute md:top-[19%] md:left-[5.3vw]">
          Premium Audio<br />For a Higher<br />Tomorrow
          <span className="block w-9 h-px bg-ink mt-5" />
        </motion.p>
        <h1 className="h-hero md:mt-24">
          <Line delay={0.35} tm>Feel every</Line>
          <Line delay={0.5} tm>Frequency</Line>
        </h1>
        <motion.p {...fade(0.9)} className="mt-5 md:mt-9 max-w-[19rem] md:max-w-[22rem] text-[.9rem] md:text-[.92rem] leading-[1.75] font-medium text-ink/85">
          Immersive sound. Unmatched comfort. Designed for the dreamers, the doers, and everyone in between.
        </motion.p>
        <motion.div {...fade(1.05)} className="mt-6 md:mt-9">
          <Link to="/shop" className="btn btn-dark">Explore collection <ArrowRight size={16} /></Link>
        </motion.div>
      </div>

      <motion.p {...fade(1.3)} className="hidden md:block absolute right-[2.6vw] top-1/2 -translate-y-1/2 vertical eyebrow text-[.62rem] z-10 pointer-events-none">
        Headphones &nbsp;/&nbsp; Earbuds
      </motion.p>
      <motion.button {...fade(1.4)} onClick={scrollDown} aria-label="Scroll to the headphone showcase"
        className="absolute left-5 md:left-[5.3vw] bottom-6 md:bottom-8 z-10 hidden sm:flex items-center gap-4 eyebrow text-[.6rem]">
        <span className="relative w-px h-10 bg-ink/30 overflow-hidden"><span className="absolute inset-x-0 top-0 h-1/2 bg-ink animate-[scrollcue_1.8s_ease-in-out_infinite]" /></span>Scroll
      </motion.button>
    </section>
  )
}
