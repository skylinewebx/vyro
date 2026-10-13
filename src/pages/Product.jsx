import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Check } from 'lucide-react'
import { bySlug, products, money } from '../data/products'
import { Swatches } from '../components/ProductCard'
import ProductCard from '../components/ProductCard'
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
  const g = p.gallery[i]
  const related = products.filter((o) => o.slug !== p.slug && o.category === p.category).slice(0, 4)
  const metrics = [['Sound', p.scores.sound, 10, '/10'], ['Comfort', p.scores.comfort, 10, '/10'], ['Noise cancellation', p.scores.anc, 10, '/10'], ['Battery', p.scores.battery, 60, ' h']]

  const addNow = () => { add(p.slug, color, qty); setAdded(true); setTimeout(() => setAdded(false), 1600) }

  return (
    <div className="pt-24 md:pt-32">
      <nav aria-label="Breadcrumb" className="px-5 md:px-10 eyebrow text-[.62rem] opacity-70 mb-6 flex gap-3">
        <Link to="/shop" className="u-link">Shop</Link><span>/</span><Link to={`/shop/${p.category}`} className="u-link capitalize">{p.category}</Link><span>/</span><span aria-current="page">{p.name}</span>
      </nav>
      <section className="px-5 md:px-10 grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-16 pb-20">
        <div>
          <div className="relative aspect-[4/5] sm:aspect-square bg-char overflow-hidden border border-gold/20">
            <AnimatePresence mode="wait">
              <motion.img key={i} src={g.src} alt={`${p.name} — ${g.label.toLowerCase()} view`} className="photo absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: g.pos, scale: g.zoom }} initial={{ opacity: 0, scale: g.zoom * 1.05 }} animate={{ opacity: 1, scale: g.zoom }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} />
            </AnimatePresence>
          </div>
          <ul className="grid grid-cols-3 gap-3 mt-3">
            {p.gallery.map((t, n) => (
              <li key={n}>
                <button onClick={() => setI(n)} aria-label={`Show ${t.label} image`} aria-pressed={i === n}
                  className={`block w-full aspect-[4/3] overflow-hidden border transition-colors ${i === n ? 'border-vy' : 'border-warm/15 hover:border-gold'}`}>
                  <img src={t.src} alt="" loading="lazy" className="photo w-full h-full object-cover" style={{ objectPosition: t.pos, transform: `scale(${t.zoom})` }} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          <p className="eyebrow text-gold mb-3">{p.kind}</p>
          <h1 className="h-sec !text-[clamp(2rem,4.4vw,3.6rem)]">{p.name}</h1>
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

      {related.length > 0 && (
        <section className="px-5 md:px-10 pb-24 border-t border-gold/10 pt-16">
          <Reveal as="h2" className="h-sec !text-[clamp(1.5rem,3vw,2.4rem)] mb-10">You may also like</Reveal>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((o, n) => <ProductCard key={o.slug} product={o} index={n} variant="feature" />)}
          </div>
        </section>
      )}
    </div>
  )
}
