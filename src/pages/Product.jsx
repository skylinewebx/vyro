import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Check } from 'lucide-react'
import { bySlug, products, money } from '../data/products'
import ProductCard, { Swatches } from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { Reveal, EASE } from '../components/ui'
import NotFound from './NotFound'

export default function Product() {
  const { slug } = useParams()
  const p = bySlug(slug)
  if (!p) return <NotFound />
  return <Detail key={p.slug} p={p} />
}

function Detail({ p }) {
  const [i, setI] = useState(0)
  const [color, setColor] = useState(p.colors[0].name)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCart()
  const gallery = [
    { label: 'Front', scale: 1, origin: '50% 50%' },
    { label: 'Close-up', scale: p.zoom.scale, origin: p.zoom.origin },
  ]
  const g = gallery[i]
  const idx = products.findIndex((o) => o.slug === p.slug)
  const related = [1, 2, 3, 4].map((n) => products[(idx + n) % products.length])
  const metrics = [['Sound', p.scores.sound, 10, '/10'], ['Comfort', p.scores.comfort, 10, '/10'], ['Noise cancellation', p.scores.anc, 10, '/10'], ['Battery', p.scores.battery, 70, ' h']].filter(([, v]) => v > 0)

  const addNow = () => { add(p.slug, color, qty); setAdded(true); setTimeout(() => setAdded(false), 1600) }

  return (
    <div className="pt-24 md:pt-32">
      <nav aria-label="Breadcrumb" className="px-5 md:px-[5.3vw] eyebrow text-[.62rem] opacity-70 mb-6 flex flex-wrap gap-3">
        <Link to="/shop" className="u-link">Collection</Link><span>/</span><Link to={`/shop/${p.category}`} className="u-link capitalize">{p.category}</Link><span>/</span><span aria-current="page">{p.name}</span>
      </nav>
      <section className="px-5 md:px-[5.3vw] grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-14 pb-20">
        <div>
          <div className="relative aspect-[8/5] bg-ink overflow-hidden border border-gold/20">
            <AnimatePresence mode="wait">
              <motion.img key={i} src={p.image} alt={`${p.name} — ${g.label.toLowerCase()} view`} width={800} height={500}
                className="absolute inset-0 w-full h-full object-cover" style={{ transformOrigin: g.origin }}
                initial={{ opacity: 0, scale: g.scale * 1.04 }} animate={{ opacity: 1, scale: g.scale }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} />
            </AnimatePresence>
            <span className="absolute top-4 left-4 text-[.68rem] tracking-[.18em] text-gold/90">{p.index} / 16</span>
          </div>
          <ul className="grid grid-cols-4 gap-3 mt-3">
            {gallery.map((t, n) => (
              <li key={t.label}>
                <button onClick={() => setI(n)} aria-label={`Show ${t.label} image`} aria-pressed={i === n}
                  className={`block w-full aspect-[8/5] overflow-hidden border transition-colors duration-300 ${i === n ? 'border-vy' : 'border-warm/15 hover:border-gold'}`}>
                  <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover" style={{ transform: `scale(${t.scale})`, transformOrigin: t.origin }} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          <p className="eyebrow text-gold mb-3">{p.kind} · {p.tagline}</p>
          <h1 className="h-sec !text-[clamp(2rem,4.2vw,3.4rem)]">{p.name}</h1>
          <p className="font-display text-2xl text-vy mt-4">{money(p.price)}</p>
          <p className="mt-6 leading-relaxed opacity-80">{p.description}</p>

          <div className="mt-8">
            <p className="eyebrow mb-3">Colour — <span className="text-gold">{color}</span></p>
            <Swatches colors={p.colors} value={color} onChange={setColor} size="w-8 h-8" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-warm/30" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1} className="w-12 h-12 grid place-items-center disabled:opacity-30"><Minus size={16} /></button>
              <span className="w-10 text-center" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className="w-12 h-12 grid place-items-center"><Plus size={16} /></button>
            </div>
            <button onClick={addNow} className="btn btn-yellow flex-1 justify-center min-w-[12rem]" aria-live="polite">
              {added ? <><Check size={16} /> Added to bag</> : <>Add to cart — {money(p.price * qty)}</>}
            </button>
          </div>
          <p className="text-xs opacity-50 mt-4">Demo store — sample pricing. No live payments are processed.</p>

          <div className="mt-10 border-t border-warm/15">
            <h2 className="eyebrow py-5">Specifications</h2>
            <dl className="divide-y divide-warm/10 text-sm">
              {p.specs.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-3"><dt className="opacity-60">{k}</dt><dd className="text-right">{v}</dd></div>)}
            </dl>
          </div>
          <div className="mt-8 space-y-4">
            {metrics.map(([l, v, max, u]) => (
              <div key={l}>
                <div className="flex justify-between text-xs mb-2"><span className="opacity-70">{l}</span><span>{v}{u}</span></div>
                <div className="bar"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: Math.min(1, v / max) }} viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE }} /></div>
              </div>
            ))}
            <p className="text-[.7rem] opacity-40">Scores are sample placeholder values.</p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-[5.3vw] pb-24 border-t border-gold/10 pt-16">
        <Reveal as="h2" className="h-sec !text-[clamp(1.5rem,3vw,2.4rem)] mb-10">You may also like</Reveal>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((o, n) => <ProductCard key={o.slug} product={o} index={n} />)}
        </div>
      </section>
    </div>
  )
}
