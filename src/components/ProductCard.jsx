import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ShoppingBag, Check } from 'lucide-react'
import { money } from '../data/products'
import { useCart } from '../context/CartContext'
import { EASE } from './ui'

export function Swatches({ colors, value, onChange, size = 'w-4 h-4', light }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Colour">
      {colors.map((c) => (
        <button key={c.name} type="button" role="radio" aria-checked={value === c.name} aria-label={c.name} title={c.name}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(c.name) }}
          className={`${size} rounded-full border transition-all duration-300 ${value === c.name ? 'ring-2 ring-offset-2 ' + (light ? 'ring-ink ring-offset-vy' : 'ring-vy ring-offset-char') + ' border-transparent' : (light ? 'border-ink/40' : 'border-warm/40')}`}
          style={{ background: c.hex }} />
      ))}
    </div>
  )
}

const useLoaded = () => {
  const [ok, setOk] = useState(false)
  return [ok, { onLoad: () => setOk(true), ref: (el) => { if (el && el.complete && el.naturalWidth) setOk(true) } }]
}

const useReveal = (index, rm) => ({
  initial: rm ? false : { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -6% 0px' },
  transition: { duration: 0.85, ease: EASE, delay: Math.min(index % 4, 3) * 0.08 },
})

/** Collection tile — mirrors the supplied 4×4 reference grid. Whole tile links to the product; the bag button adds it. */
export function ProductTile({ product: p, index = 0 }) {
  const { add } = useCart()
  const rm = useReducedMotion()
  const [added, setAdded] = useState(false)
  const [ok, loadProps] = useLoaded()
  const addNow = () => { add(p.slug, p.colors[0].name); setAdded(true); setTimeout(() => setAdded(false), 1400) }
  return (
    <motion.article {...useReveal(index, rm)} className="tile group relative aspect-[8/5] overflow-hidden bg-ink border border-warm/10 hover:border-gold/50 transition-colors duration-500">
      <img src={p.image} alt={`${p.name} — ${p.kind}`} width={800} height={500} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" {...loadProps} className={`tile-img absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ok ? "opacity-100" : "opacity-0"}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/75 to-transparent pointer-events-none" />
      <Link to={`/product/${p.slug}`} aria-label={`${p.name} — ${p.kind}, ${money(p.price)}`} className="absolute inset-0 z-10" />
      <span className="absolute top-4 left-4 text-[.68rem] tracking-[.18em] text-gold/90 pointer-events-none">{p.index}</span>
      <div className="absolute left-4 bottom-4 pointer-events-none max-w-[55%]">
        <h3 className="font-display text-[.82rem] tracking-[-.01em] text-gold">{p.name}</h3>
        <p className="mt-2 text-[.7rem] leading-snug text-warm/55">{p.kind}</p>
        <p className="text-[.7rem] leading-snug text-warm/90">{p.tagline}</p>
        <ArrowRight size={15} className="mt-3 text-gold transition-transform duration-500 group-hover:translate-x-1.5" />
      </div>
      <div className="absolute right-3 bottom-3 z-20 flex items-center gap-3">
        <span className="text-[.78rem] font-semibold">{money(p.price)}</span>
        <button onClick={addNow} aria-label={`Add ${p.name} to cart`} className={`w-9 h-9 grid place-items-center rounded-full border transition-colors duration-300 ${added ? 'bg-vy border-vy text-ink' : 'border-gold/60 text-gold hover:bg-vy hover:border-vy hover:text-ink'}`}>
          {added ? <Check size={15} /> : <ShoppingBag size={15} />}
        </button>
      </div>
    </motion.article>
  )
}

/** Homepage featured card (tall, bordered, price + swatches + arrow). */
export default function ProductCard({ product: p, index = 0 }) {
  const [color, setColor] = useState(p.colors[0].name)
  const [ok, loadProps] = useLoaded()
  const rm = useReducedMotion()
  return (
    <motion.article {...useReveal(index, rm)} className="group relative bg-char/60 border border-gold/25 hover:border-gold/80 transition-colors duration-500 flex flex-col">
      <Link to={`/product/${p.slug}`} aria-label={`${p.name} — ${p.kind}`} className="relative block aspect-[5/4] overflow-hidden bg-ink">
        <img src={p.image} alt={`${p.name} ${p.kind.toLowerCase()}`} width={800} height={500} loading="lazy" decoding="async"
          {...loadProps} className={`tile-img w-full h-full object-cover object-[68%_50%] scale-[1.15] group-hover:scale-[1.22] transition-[transform,opacity] duration-[1200ms] ${ok ? "opacity-100" : "opacity-0"}`} style={{ transitionTimingFunction: 'var(--ease-out-expo)' }} />
        <span className="absolute top-4 left-4 text-[.68rem] tracking-[.18em] text-gold/90">{p.index}</span>
      </Link>
      <div className="p-5 pt-4">
        <h3 className="font-display text-[.9rem] text-vy tracking-tight">{p.name}</h3>
        <p className="text-xs opacity-70 mt-1">{p.kind}</p>
        <p className="mt-3 text-[.95rem] font-semibold">{money(p.price)}</p>
        <div className="mt-4 flex items-center justify-between">
          <Swatches colors={p.colors} value={color} onChange={setColor} />
          <Link to={`/product/${p.slug}`} aria-label={`View ${p.name}`} className="text-gold group-hover:text-vy group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500"><ArrowUpRight /></Link>
        </div>
      </div>
    </motion.article>
  )
}
