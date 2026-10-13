import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { Logo, EASE } from './ui'
import { lockScroll } from './SmoothScroll'
import { useCart } from '../context/CartContext'
import { products, money } from '../data/products'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/journal', label: 'Journal' },
]
const menu = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop/headphones', label: 'Headphones' },
  { to: '/shop/earbuds', label: 'Wireless Earbuds' },
  { to: '/shop/accessories', label: 'Accessories' },
  { to: '/about', label: 'About VYRO' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
]

const yellowTop = (p) => p === '/' || p.startsWith('/shop') || p === '/about' || p === '/journal' || p === '/contact'

function Hamburger({ open, ...p }) {
  return (
    <button {...p} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu" className="relative w-10 h-10 grid place-items-center">
      <span className="sr-only">Menu</span>
      <span className="block w-7">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="block h-[2px] bg-current my-[6px] origin-center"
            animate={open ? { y: i === 1 ? 0 : (i === 0 ? 8 : -8), rotate: i === 0 ? 45 : i === 2 ? -45 : 0, opacity: i === 1 ? 0 : 1 } : { y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }} />
        ))}
      </span>
    </button>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { count, setOpen: openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState('')
  const firstLink = useRef(null)
  const searchInput = useRef(null)

  useEffect(() => { setMenuOpen(false); setSearchOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    lockScroll(menuOpen || searchOpen)
    if (menuOpen) setTimeout(() => firstLink.current?.focus(), 450)
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 200)
    const esc = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setSearchOpen(false) } }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [menuOpen, searchOpen])

  const onYellow = yellowTop(pathname) && !scrolled && !menuOpen && !searchOpen
  const matches = q.trim() ? products.filter((p) => (p.name + ' ' + p.kind + ' ' + p.category).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5) : []
  const submit = (e) => { e.preventDefault(); navigate(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`); setQ('') }

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-[background,color,backdrop-filter] duration-500 ${menuOpen ? 'text-ink bg-transparent' : onYellow ? 'text-ink bg-transparent' : 'text-warm bg-ink/85 backdrop-blur-md'}`}>
        <div className="mx-auto flex items-center justify-between px-5 md:px-10 h-[4.5rem] md:h-24">
          <Logo className={menuOpen ? 'text-ink' : ''} />
          <nav aria-label="Primary" className="hidden md:flex gap-12 absolute left-1/2 -translate-x-1/2">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `eyebrow u-link pb-1.5 ${isActive && (n.to === '/' || pathname.startsWith(n.to)) ? 'font-bold' : 'font-medium'}`}
                aria-current={undefined}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className={`flex items-center gap-2 md:gap-4 ${menuOpen ? 'text-ink' : ''}`}>
            <button onClick={() => setSearchOpen(true)} aria-label="Search products" className="w-10 h-10 grid place-items-center"><Search size={20} strokeWidth={1.6} /></button>
            <button onClick={() => openCart(true)} aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`} className="relative w-10 h-10 grid place-items-center">
              <ShoppingBag size={20} strokeWidth={1.6} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute top-1 right-0 min-w-[1.1rem] h-[1.1rem] px-1 grid place-items-center rounded-full bg-vy text-ink text-[.62rem] font-bold">{count}</motion.span>
                )}
              </AnimatePresence>
            </button>
            <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu"
            className="fixed inset-0 z-40 bg-vy text-ink overflow-y-auto"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }} animate={{ clipPath: 'circle(150% at 95% 4%)' }} exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.8, ease: EASE }}>
            <div className="min-h-full px-5 md:px-10 pt-28 pb-10 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
              <ul className="space-y-1 md:space-y-2">
                {menu.map((m, i) => (
                  <li key={m.to} className="overflow-hidden">
                    <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.045 }}>
                      <Link ref={i === 0 ? firstLink : null} to={m.to} className="group flex items-baseline gap-4 font-display uppercase tracking-[-0.03em] text-[clamp(1.7rem,5.2vw,3.6rem)] leading-[1.15] hover:pl-4 transition-[padding] duration-300">
                        <span className="eyebrow opacity-50 w-6">{String(i + 1).padStart(2, '0')}</span>{m.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }} className="md:text-right">
                <p className="eyebrow mb-3">Premium Audio<br />For a Higher Tomorrow</p>
                <p className="text-sm opacity-70 max-w-xs md:ml-auto">Feel Every Frequency.</p>
              </motion.div>
            </div>
          </motion.div>
        )}
        {searchOpen && (
          <motion.div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm text-warm overflow-y-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="absolute top-5 right-5 md:top-8 md:right-10 w-10 h-10 grid place-items-center"><X size={26} strokeWidth={1.5} /></button>
            <div className="max-w-3xl mx-auto px-5 pt-28 md:pt-40">
              <form onSubmit={submit} role="search">
                <label htmlFor="site-search" className="eyebrow text-gold">Search the collection</label>
                <div className="flex items-center gap-4 border-b border-warm/30 focus-within:border-vy mt-4">
                  <input id="site-search" ref={searchInput} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Headphones, earbuds, VYRO PRO…"
                    className="w-full bg-transparent py-4 text-2xl md:text-4xl font-display outline-none placeholder:text-warm/30" autoComplete="off" />
                  <button type="submit" aria-label="Search" className="text-vy"><ArrowRight /></button>
                </div>
              </form>
              <ul className="mt-8 divide-y divide-warm/10">
                {matches.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/product/${p.slug}`} className="flex items-center gap-4 py-4 hover:text-vy transition-colors">
                      <img src={p.image} alt="" className="w-14 h-14 object-cover photo" />
                      <span className="flex-1"><span className="block font-display text-sm">{p.name}</span><span className="text-xs opacity-60">{p.kind}</span></span>
                      <span className="text-sm">{money(p.price)}</span>
                    </Link>
                  </li>
                ))}
                {q.trim() && matches.length === 0 && <li className="py-4 text-sm opacity-60">No products match “{q}”.</li>}
              </ul>
              {!q.trim() && <p className="mt-8 text-sm opacity-50">Try “earbuds”, “ONE”, or “gold”.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
