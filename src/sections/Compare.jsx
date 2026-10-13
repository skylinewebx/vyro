import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { products, bySlug, money } from '../data/products'
import { Reveal, EASE } from '../components/ui'

const metrics = [
  { key: 'sound', label: 'Sound quality', max: 10, fmt: (v) => `${v}/10` },
  { key: 'comfort', label: 'Comfort', max: 10, fmt: (v) => `${v}/10` },
  { key: 'battery', label: 'Battery life', max: 70, fmt: (v) => (v ? `${v} h` : 'Wired') },
  { key: 'anc', label: 'Noise cancellation', max: 10, fmt: (v) => (v ? `${v}/10` : 'None') },
]

function Panel({ id, value, onChange, other }) {
  const rm = useReducedMotion()
  const p = bySlug(value)
  return (
    <div className="bg-char/60 border border-gold/20 flex flex-col">
      <Link to={`/product/${p.slug}`} className="block aspect-[8/5] overflow-hidden bg-ink" aria-label={`View ${p.name}`}>
        <img key={p.slug} src={p.image} alt={`${p.name} ${p.kind.toLowerCase()}`} width={800} height={500} loading="lazy" className="w-full h-full object-cover animate-[fadein_.6s_ease]" />
      </Link>
      <div className="p-5 md:p-6">
        <label htmlFor={id} className="sr-only">Choose a model to compare</label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field !bg-char font-display text-sm mb-1">
          {products.map((o) => <option key={o.slug} value={o.slug} disabled={o.slug === other}>{o.name}</option>)}
        </select>
        <p className="text-xs opacity-60 mb-6">{p.kind} · {money(p.price)}</p>
        <ul className="space-y-4">
          {metrics.map((m) => {
            const v = p.scores[m.key]
            return (
              <li key={m.key}>
                <div className="flex justify-between text-xs mb-2"><span className="opacity-80">{m.label}</span><span className="font-semibold">{m.fmt(v)}</span></div>
                <div className="bar" role="img" aria-label={`${m.label}: ${m.fmt(v)}`}>
                  <motion.i key={p.slug + m.key} initial={rm ? false : { scaleX: 0 }} whileInView={{ scaleX: Math.min(1, v / m.max) }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} style={{ scaleX: Math.min(1, v / m.max) }} />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function Compare() {
  const [a, setA] = useState('vyro-one')
  const [b, setB] = useState('vyro-pro')
  return (
    <section className="bg-ink px-5 md:px-[5.3vw] py-20 md:py-32 border-t border-gold/10" aria-labelledby="cmp-h">
      <div className="grid lg:grid-cols-[0.8fr_2fr] gap-10 lg:gap-14 items-start">
        <div>
          <Reveal className="eyebrow flex items-center gap-4 mb-5 text-gold"><span>04</span><span className="tick" /></Reveal>
          <Reveal as="h2" id="cmp-h" delay={0.05} className="h-sec">Compare<br />&amp; choose</Reveal>
          <Reveal delay={0.12} className="mt-5 max-w-xs text-[.95rem] opacity-75 leading-relaxed">Find the perfect balance of sound, comfort and performance. Pick any two of the 16 models.</Reveal>
          <Reveal delay={0.2} className="mt-8"><Link to="/shop" className="btn btn-line">Browse all 16 →</Link></Reveal>
        </div>
        <Reveal className="grid sm:grid-cols-2 gap-4">
          <Panel id="cmp-a" value={a} onChange={setA} other={b} />
          <Panel id="cmp-b" value={b} onChange={setB} other={a} />
        </Reveal>
      </div>
      <p className="mt-6 text-xs opacity-50">Scores are sample placeholder values for demonstration — edit them in <code>src/data/products.js</code>.</p>
    </section>
  )
}
