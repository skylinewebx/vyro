import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { products, bySlug, money } from '../data/products'
import { Reveal, SectionHead, EASE } from '../components/ui'

const metrics = [
  { key: 'sound', label: 'Sound quality', max: 10, fmt: (v) => `${v}/10` },
  { key: 'comfort', label: 'Comfort', max: 10, fmt: (v) => `${v}/10` },
  { key: 'battery', label: 'Battery life', max: 60, fmt: (v) => `${v} h` },
  { key: 'anc', label: 'Noise cancellation', max: 10, fmt: (v) => `${v}/10` },
]

function Panel({ p, value, onChange, other }) {
  const rm = useReducedMotion()
  return (
    <div className="bg-char/70 border border-gold/20 p-5 md:p-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
        <Link to={`/product/${p.slug}`} className="block w-full sm:w-44 aspect-square shrink-0 overflow-hidden bg-ink">
          <img src={p.image} alt={`${p.name} ${p.kind.toLowerCase()}`} loading="lazy" style={{ objectPosition: p.pos }} className="photo w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </Link>
        <div className="flex-1">
          <label className="eyebrow text-gold block mb-2" htmlFor={`cmp-${other}`}>Model</label>
          <select id={`cmp-${other}`} value={value} onChange={(e) => onChange(e.target.value)} className="field !bg-char font-display text-sm mb-3">
            {products.map((o) => <option key={o.slug} value={o.slug} disabled={o.slug === other}>{o.name}</option>)}
          </select>
          <p className="text-sm opacity-70">{p.kind} · {money(p.price)}</p>
        </div>
      </div>
      <ul className="mt-8 space-y-5">
        {metrics.map((m) => {
          const v = p.scores[m.key]
          return (
            <li key={m.key}>
              <div className="flex justify-between text-sm mb-2"><span>{m.label}</span><span className="font-semibold">{m.fmt(v)}</span></div>
              <div className="bar" role="img" aria-label={`${m.label}: ${m.fmt(v)}`}>
                <motion.i key={p.slug + m.key} initial={rm ? false : { scaleX: 0 }} whileInView={{ scaleX: Math.min(1, v / m.max) }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} style={{ scaleX: Math.min(1, v / m.max) }} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Compare() {
  const [a, setA] = useState('vyro-one')
  const [b, setB] = useState('vyro-pro')
  return (
    <section className="bg-ink px-5 md:px-10 py-20 md:py-32 border-t border-gold/10" aria-labelledby="cmp-h">
      <SectionHead n="04" title={<span id="cmp-h">Compare &amp; choose</span>}>
        Find the perfect balance of sound, comfort and performance. Pick any two models.
      </SectionHead>
      <Reveal className="grid lg:grid-cols-2 gap-4">
        <Panel p={bySlug(a)} value={a} onChange={setA} other={b} />
        <Panel p={bySlug(b)} value={b} onChange={setB} other={a} />
      </Reveal>
      <p className="mt-6 text-xs opacity-50">Scores are sample placeholder values for demonstration — edit them in <code>src/data/products.js</code>.</p>
    </section>
  )
}
