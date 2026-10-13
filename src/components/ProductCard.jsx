import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { money } from '../data/products'
import { useCart } from '../context/CartContext'
import { EASE } from './ui'

export function Swatches({ colors, value, onChange, size = 'w-4 h-4', light }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Colour">
      {colors.map((c) => (
        <button key={c.name} type="button" role="radio" aria-checked={value === c.name} aria-label={c.name} title={c.name}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(c.name) }}
          className={`${size} rounded-full border transition-all ${value === c.name ? 'ring-2 ring-offset-2 ' + (light ? 'ring-ink ring-offset-vy' : 'ring-vy ring-offset-char') + ' border-transparent' : (light ? 'border-ink/40' : 'border-warm/40')}`}
          style={{ background: c.hex }} />
      ))}
    </div>
  )
}

/** Product card. `variant="feature"` = compact home card; default = shop card with Add to Cart. */
export default function ProductCard({ product: p, index = 0, variant = 'shop' }) {
  const [color, setColor] = useState(p.colors[0].name)
  const { add } = useCart()
  const rm = useReducedMotion()
  const [added, setAdded] = useState(false)
  const addNow = () => { add(p.slug, color); setAdded(true); setTimeout(() => setAdded(false), 1400) }

  return (
    <motion.article
      initial={rm ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.85, ease: EASE, delay: (index % 4) * 0.09 }}
      className="group relative bg-char border border-gold/20 hover:border-gold/70 transition-colors duration-500 flex flex-col"
    >
      <Link to={`/product/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ink" aria-label={`${p.name} — ${p.kind}`}>
        <img src={p.image} alt={`${p.name} ${p.kind.toLowerCase()}`} loading="lazy" decoding="async" style={{ objectPosition: p.pos }}
          className="photo w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.07]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <span className="absolute top-4 left-4 eyebrow text-[.6rem] text-gold">{String(p.featured).padStart(2, '0')}</span>
      </Link>
      <div className="p-5 pt-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[.95rem] text-vy tracking-tight"><Link to={`/product/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] sm:after:hidden">{p.name}</Link></h3>
            <p className="text-xs opacity-70 mt-1">{p.kind}</p>
          </div>
          <p className="text-sm font-semibold">{money(p.price)}</p>
        </div>
        <div className="mt-5 flex items-center justify-between relative z-10">
          <Swatches colors={p.colors} value={color} onChange={setColor} />
          {variant === 'feature' ? (
            <Link to={`/product/${p.slug}`} aria-label={`View ${p.name}`} className="text-gold group-hover:text-vy group-hover:translate-x-1 transition-all"><ArrowUpRight /></Link>
          ) : null}
        </div>
        {variant === 'shop' && (
          <button onClick={addNow} className={`btn mt-5 justify-center relative z-10 ${added ? 'btn-yellow' : 'btn-line'}`} aria-live="polite">
            <ShoppingBag size={15} /> {added ? 'Added ✓' : 'Add to cart'}
          </button>
        )}
      </div>
    </motion.article>
  )
}
