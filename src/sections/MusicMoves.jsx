import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, EASE } from '../components/ui'

/** Reference layout: yellow field, type on the left, the profile portrait on the right, small vertical tag at far right. */
export default function MusicMoves() {
  const rm = useReducedMotion()
  return (
    <section className="hero-bg text-ink on-yellow overflow-hidden relative" aria-labelledby="music-h">
      <div className="grid md:grid-cols-[1fr_1.1fr] items-center min-h-[84vh]">
        <div className="px-5 md:px-[5.3vw] py-16 md:py-24 relative z-10">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>03</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="music-h" delay={0.05} className="h-sec">Music<br />moves you</Reveal>
          <Reveal delay={0.12} className="mt-6 max-w-sm font-medium leading-relaxed">More than just sound — it’s a lifestyle. Feel the rhythm, live the moment.</Reveal>
          <Reveal delay={0.2} className="mt-9"><Link to="/journal" className="btn btn-dark">Explore lifestyle →</Link></Reveal>
        </div>
        <div className="relative h-[70vh] md:h-[84vh] flex items-end justify-center md:justify-start">
          <motion.img src="/img/hero.webp" width={1480} height={1718} loading="lazy" decoding="async"
            alt="Profile portrait of a woman in black VYRO headphones, glasses and a dark turtleneck on a yellow backdrop"
            className="hero-photo h-[92%] w-auto max-w-none md:h-[96%]"
            initial={rm ? false : { opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1.2, ease: EASE }} />
        </div>
      </div>
      <Reveal className="hidden md:block absolute right-[2.6vw] top-1/2 -translate-y-1/2 eyebrow text-[.62rem] leading-[2] text-right">Sound<br />fuels<br />life<span className="block w-7 h-px bg-ink mt-3 ml-auto" /></Reveal>
    </section>
  )
}
