import { Link } from 'react-router-dom'
import { Gem, AudioLines, BatteryCharging, Smile } from 'lucide-react'
import { ParallaxImage, Reveal } from '../components/ui'

const feats = [
  [Gem, 'Premium materials', 'Steel, protein leather and matte finishes.'],
  [AudioLines, 'Active noise cancellation', 'Quiet the world, keep the music.'],
  [BatteryCharging, 'Long battery life', 'Hours that outlast your day.'],
  [Smile, 'Comfortable fit', 'Soft cushions that disappear on the head.'],
]

export default function BuiltDifferent() {
  return (
    <section className="relative bg-ink overflow-hidden" aria-labelledby="built-h">
      <div className="grid md:grid-cols-[1.05fr_1fr] min-h-[85vh]">
        <ParallaxImage src="/img/macro.jpg" alt="Macro detail of a black over-ear headphone in low light" className="h-[55vh] md:h-auto" pos="50% 50%" speed={8} />
        <div className="relative bg-vy text-ink on-yellow md:-ml-[9%] md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)] px-5 md:pl-[16%] md:pr-12 py-16 md:py-24 flex flex-col justify-center">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>02</span><span className="tick" /></Reveal>
          <Reveal as="h2" delay={0.05} className="h-sec" id="built-h">Built<br />different</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-sm text-[.95rem] leading-relaxed font-medium">Premium materials. Precision engineering. Every detail designed for a superior listening experience.</Reveal>
          <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {feats.map(([I, t, d], i) => (
              <Reveal as="li" key={t} delay={0.15 + i * 0.08} className="flex gap-4 items-start">
                <I size={26} strokeWidth={1.4} className="shrink-0 mt-0.5" />
                <span><span className="eyebrow block mb-1">{t}</span><span className="text-sm opacity-80">{d}</span></span>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.4} className="mt-10"><Link to="/product/vyro-pro" className="btn btn-dark">Discover more →</Link></Reveal>
        </div>
      </div>
    </section>
  )
}
