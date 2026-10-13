import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, EASE } from '../components/ui'

/** Yellow field, type on the left, the blue-shirt portrait on the right (its own yellow-and-black set). */
export default function MusicMoves() {
  const rm = useReducedMotion()
  return (
    <section className="music-bg text-ink on-yellow overflow-hidden relative" aria-labelledby="music-h">
      <div className="grid md:grid-cols-[0.8fr_1.35fr] items-center min-h-[94vh]">
        <div className="px-5 md:px-[5.3vw] py-20 md:py-32 relative z-10">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>03</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="music-h" delay={0.05} className="h-sec">Music<br />moves you</Reveal>
          <Reveal delay={0.12} className="mt-6 max-w-sm font-medium leading-relaxed">More than just sound — it’s a lifestyle. Feel the rhythm, live the moment.</Reveal>
          <Reveal delay={0.2} className="mt-9"><Link to="/journal" className="btn btn-dark">Explore lifestyle →</Link></Reveal>
          <Reveal delay={0.3} className="mt-14 eyebrow leading-[1.9] md:hidden">Sound<br />fuels<br />life<span className="block w-8 h-px bg-ink mt-3" /></Reveal>
        </div>
        <div className="relative self-stretch min-h-[62vh] md:min-h-0">
          <motion.img src="/img/music.webp" width={1536} height={1024} loading="lazy" decoding="async"
            alt="A woman in a bright blue shirt with her eyes closed, holding black over-ear headphones to her ears against a yellow and black backdrop"
            className="music-photo absolute inset-0 w-full h-full object-cover object-[42%_30%] md:object-[38%_center]"
            initial={rm ? false : { opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 1.3, ease: EASE }} />
        </div>
      </div>
      <Reveal className="hidden md:block absolute left-[5.3vw] bottom-12 eyebrow text-[.62rem] leading-[2] z-10">Sound<br />fuels<br />life<span className="block w-7 h-px bg-ink mt-3" /></Reveal>
    </section>
  )
}
