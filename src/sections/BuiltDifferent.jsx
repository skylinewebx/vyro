import { Link } from 'react-router-dom'
import { Gem, AudioLines, BatteryCharging, Droplets } from 'lucide-react'
import { ParallaxImage, Reveal } from '../components/ui'

const feats = [
  [Gem, 'Premium materials'],
  [AudioLines, 'Active noise cancellation'],
  [BatteryCharging, 'Long battery life'],
  [Droplets, 'Water resistant (IPX5, sample)'],
]

/** Reference layout: macro photograph left → yellow diagonal with the headline → black feature rail right. */
export default function BuiltDifferent() {
  return (
    <section className="relative bg-ink overflow-hidden" aria-labelledby="built-h">
      <div className="grid lg:grid-cols-[1fr_1.05fr_0.8fr] min-h-[80vh]">
        <ParallaxImage src="/img/macro.jpg" alt="Macro detail of a black over-ear headphone in low light" className="h-[48vh] lg:h-auto lg:col-span-1" pos="50% 50%" speed={5} />

        <div className="relative bg-vy text-ink on-yellow lg:-ml-[9%] lg:-mr-[9%] lg:z-10 lg:[clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)] px-5 lg:pl-[16%] lg:pr-[14%] py-16 lg:py-24 flex flex-col justify-center">
          <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>02</span><span className="tick" /></Reveal>
          <Reveal as="h2" delay={0.05} className="h-sec" id="built-h">Built<br />different</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-sm text-[.95rem] leading-relaxed font-medium">Premium materials. Precision engineering. Every detail designed for a superior listening experience.</Reveal>
          <Reveal delay={0.25} className="mt-9"><Link to="/product/vyro-pro" className="btn btn-dark">Discover more →</Link></Reveal>
        </div>

        <ul className="bg-ink px-5 lg:pl-[16%] lg:pr-8 py-12 lg:py-24 flex flex-col justify-center gap-7">
          {feats.map(([I, t], i) => (
            <Reveal as="li" key={t} delay={0.1 + i * 0.08} className="flex gap-5 items-center">
              <I size={30} strokeWidth={1.2} className="shrink-0 text-warm" />
              <span className="eyebrow text-[.64rem] leading-relaxed">{t}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
