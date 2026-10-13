import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Reveal, EASE } from '../components/ui'

const sorts = [['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name A–Z']]

export default function Shop() {
  const { category = 'all' } = useParams()
  const [sp, setSp] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const q = sp.get('q') || ''
  const sort = sp.get('sort') || 'featured'

  const setParam = (k, v) => {
    const n = new URLSearchParams(sp)
    v ? n.set(k, v) : n.delete(k)
    setSp(n, { replace: true })
  }

  const valid = categories.some((c) => c.slug === category)
  const list = useMemo(() => {
    let l = products.filter((p) => category === 'all' || p.category === category)
    const t = q.trim().toLowerCase()
    if (t) l = l.filter((p) => [p.name, p.kind, p.category, p.blurb, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(t))
    const s = { featured: (a, b) => a.featured - b.featured, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name) }[sort] || (() => 0)
    return [...l].sort(s)
  }, [category, q, sort])

  const title = { all: 'The VYRO Collection', headphones: 'Headphones', earbuds: 'Wireless Earbuds', accessories: 'Accessories' }[category] || 'The VYRO Collection'

  const controls = (stacked) => (
    <div className={stacked ? 'space-y-8' : 'flex flex-wrap items-center gap-x-8 gap-y-4 w-full'}>
      <nav aria-label="Categories" className={stacked ? 'flex flex-col gap-3' : 'flex flex-wrap gap-2'}>
        {categories.map((c) => (
          <Link key={c.slug} to={{ pathname: c.to, search: sp.toString() ? `?${sp}` : '' }} onClick={() => setSheet(false)} aria-current={c.slug === category ? 'page' : undefined}
            className={`eyebrow border px-4 py-2.5 transition-colors ${c.slug === category ? 'bg-vy text-ink border-vy' : 'border-warm/25 hover:border-vy'}`}>{c.label}</Link>
        ))}
      </nav>
      <div className={stacked ? '' : 'flex-1 min-w-[12rem] max-w-sm'}>
        <label htmlFor={`q-${stacked}`} className="sr-only">Search products</label>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
          <input id={`q-${stacked}`} type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search products" className="field !pl-10" />
        </div>
      </div>
      <div>
        <label htmlFor={`s-${stacked}`} className="sr-only">Sort by</label>
        <select id={`s-${stacked}`} value={sort} onChange={(e) => setParam('sort', e.target.value === 'featured' ? '' : e.target.value)} className="field !bg-ink">
          {sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div>
      {/* Editorial banner */}
      <section className="relative bg-vy text-ink on-yellow overflow-hidden pt-28 md:pt-36">
        <div className="grid md:grid-cols-[1.5fr_1fr] items-end">
          <div className="px-5 md:px-10 pb-10 md:pb-16">
            <Reveal className="eyebrow flex items-center gap-4 mb-5"><span>Shop</span><span className="tick" /><span>{list.length} products</span></Reveal>
            <h1 className="h-hero !text-[clamp(2.1rem,8.4vw,6.4rem)]">
              {category === 'all' ? <><span className="block overflow-hidden"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE }}>The VYRO</motion.span></span>
                <span className="block overflow-hidden"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.12 }}>Collection</motion.span></span></>
                : <span className="block overflow-hidden"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE }}>{title}</motion.span></span>}
            </h1>
            <p className="mt-5 max-w-sm font-medium text-[.95rem]">Premium audio gear for every vibe. Find your perfect sound.</p>
          </div>
          <div className="relative h-48 md:h-80 bg-ink">
            <img src="/img/yellow.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-[75%_50%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-vy/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="bg-ink px-5 md:px-10 pt-10 pb-24 min-h-[60vh]">
        <div className="hidden lg:flex mb-10">{controls(false)}</div>
        <div className="lg:hidden mb-8 flex items-center justify-between gap-4">
          <p className="text-sm opacity-70" aria-live="polite">{list.length} result{list.length === 1 ? '' : 's'}</p>
          <button onClick={() => setSheet(true)} className="btn btn-line"><SlidersHorizontal size={15} /> Filters & sort</button>
        </div>

        {list.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto">
            <p className="font-display text-2xl mb-3">{category === 'accessories' && !q ? 'Accessories are coming soon' : 'No products found'}</p>
            <p className="text-sm opacity-60 mb-8">{category === 'accessories' && !q ? 'Cases, cables and cushions are on the way. Browse our headphones and earbuds in the meantime.' : 'Try a different search or clear your filters.'}</p>
            {q ? <button onClick={() => setParam('q', '')} className="btn btn-yellow">Clear search</button> : <Link to="/shop" className="btn btn-yellow">Shop all →</Link>}
          </div>
        )}
        {!valid && <p className="sr-only">Unknown category</p>}
      </section>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Filters and sort">
            <motion.div className="absolute inset-0 bg-ink/70" onClick={() => setSheet(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="absolute bottom-0 inset-x-0 bg-char p-6 pb-10 max-h-[85vh] overflow-y-auto" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="flex justify-between items-center mb-6"><h2 className="eyebrow">Filters &amp; sort</h2><button onClick={() => setSheet(false)} aria-label="Close filters" className="w-10 h-10 grid place-items-center"><X size={22} /></button></div>
              {controls(true)}
              <button onClick={() => setSheet(false)} className="btn btn-yellow w-full justify-center mt-8">Show {list.length} result{list.length === 1 ? '' : 's'}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
