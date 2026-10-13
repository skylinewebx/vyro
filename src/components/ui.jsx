import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)
export const EASE = [0.2, 0.7, 0.2, 1]

export function Logo({ className = '', to = '/' }) {
  return (
    <Link to={to} aria-label="VYRO — home" className={`font-display text-[1.6rem] leading-none tracking-[-0.04em] font-normal ${className}`}>
      VYRO
    </Link>
  )
}

/** Fade-up reveal. Honors prefers-reduced-motion. */
export function Reveal({ as = 'div', delay = 0, y = 28, className = '', children, ...rest }) {
  const rm = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={rm ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

/** Masked image reveal + scroll parallax. */
export function ParallaxImage({ src, alt, className = '', imgClass = '', pos = '50% 50%', speed = 5, eager = false, filter = true }) {
  const wrap = useRef(null)
  const img = useRef(null)
  const rm = useReducedMotion()
  useEffect(() => {
    if (rm || !img.current) return
    // parallax only on larger screens — keeps phones light and scrolling stable
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      gsap.fromTo(img.current, { yPercent: -speed }, {
        yPercent: speed, ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
    }, wrap)
    return () => mm.revert()
  }, [rm, speed])
  return (
    <motion.div
      ref={wrap}
      className={`relative overflow-hidden ${className}`}
      initial={rm ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <img ref={img} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
        style={{ objectPosition: pos, height: `${100 + speed * 2}%`, marginTop: `-${speed}%` }}
        className={`w-full object-cover ${filter ? 'photo' : ''} ${imgClass}`} />
    </motion.div>
  )
}

export function SectionHead({ n, title, link, linkLabel = 'View all', tone = 'dark', children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
      <div>
        <Reveal className={`eyebrow flex items-center gap-4 mb-5 ${tone === 'dark' ? 'text-gold' : 'text-ink'}`}>
          <span>{n}</span><span className="tick" />
        </Reveal>
        <Reveal as="h2" delay={0.05} className="h-sec">{title}</Reveal>
        {children && <Reveal delay={0.12} className="mt-4 max-w-md text-[.95rem] opacity-75 leading-relaxed">{children}</Reveal>}
      </div>
      {link && (
        <Reveal>
          <Link to={link} className="eyebrow u-link inline-flex items-center gap-3 pb-1 text-vy">{linkLabel} <span aria-hidden>→</span></Link>
        </Reveal>
      )}
    </div>
  )
}
