import { Link } from 'react-router-dom'
import { Reveal, ParallaxImage } from '../components/ui'

const values = [
  ['01', 'Sound first', 'Every decision starts with how it will sound and feel on the head.'],
  ['02', 'Considered design', 'Minimal forms, honest materials and finishes that age well.'],
  ['03', 'Made for life', 'Comfort and battery built around real days, not spec sheets.'],
]

export default function About() {
  return (
    <div>
      <section className="bg-vy text-ink on-yellow pt-36 md:pt-44 pb-20 px-5 md:px-10">
        <Reveal className="eyebrow mb-5">About VYRO</Reveal>
        <Reveal as="h1" className="h-hero !text-[clamp(2.2rem,8vw,6.4rem)]">Premium audio<br />for a higher<br />tomorrow.</Reveal>
        <Reveal delay={0.1} className="mt-8 max-w-lg font-medium leading-relaxed">VYRO is a premium headphone and earbud brand for the dreamers, the doers, and everyone in between — bold, minimal and made to be felt.</Reveal>
      </section>
      <section className="bg-ink grid md:grid-cols-2">
        <ParallaxImage src="/img/macro.jpg" alt="Detail of a black VYRO-style headphone ear cup" className="h-[50vh] md:h-[70vh]" />
        <div className="px-5 md:px-14 py-16 flex flex-col justify-center">
          <Reveal className="eyebrow text-gold mb-4">Our idea</Reveal>
          <Reveal as="h2" className="h-sec !text-[clamp(1.6rem,3.4vw,2.8rem)] mb-6">Feel every frequency.</Reveal>
          <Reveal delay={0.1} className="opacity-80 leading-relaxed max-w-md">We believe great audio should be felt as much as heard. That means soft materials, thoughtful acoustics and a design language that stays out of the way of the music.</Reveal>
          <Reveal delay={0.2} className="mt-8"><Link to="/shop" className="btn btn-yellow">Shop the collection →</Link></Reveal>
        </div>
      </section>
      <section className="bg-ink px-5 md:px-10 py-20 border-t border-gold/10">
        <div className="grid md:grid-cols-3 gap-10">
          {values.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.1}><p className="eyebrow text-gold mb-4">{n}</p><h3 className="font-display text-xl mb-3">{t}</h3><p className="opacity-70 text-sm leading-relaxed">{d}</p></Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
