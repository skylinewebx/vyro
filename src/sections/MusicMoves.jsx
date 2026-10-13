import { Link } from 'react-router-dom'
import { ParallaxImage, Reveal } from '../components/ui'

export default function MusicMoves() {
  return (
    <section className="bg-vy text-ink on-yellow overflow-hidden" aria-labelledby="music-h">
      <div className="grid md:grid-cols-2 items-center min-h-[80vh]">
        <div className="px-5 md:px-10 py-16 md:py-24 order-2 md:order-1">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>03</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="music-h" delay={0.05} className="h-sec">Music<br />moves you.</Reveal>
          <Reveal delay={0.12} className="mt-6 max-w-sm font-medium leading-relaxed">More than just sound — it’s a lifestyle. Feel the rhythm, live the moment.</Reveal>
          <Reveal delay={0.2} className="mt-9"><Link to="/journal" className="btn btn-dark">Explore lifestyle →</Link></Reveal>
          <Reveal delay={0.3} className="mt-14 eyebrow leading-[1.9]">Sound<br />fuels<br />life<span className="block w-8 h-px bg-ink mt-3" /></Reveal>
        </div>
        <ParallaxImage src="/img/yellow.jpg" alt="Black wireless headphones resting on a vivid yellow surface" className="order-1 md:order-2 h-[60vh] md:h-[85vh]" pos="70% 50%" speed={7} filter={false} />
      </div>
    </section>
  )
}
