import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { money } from '../data/products'
import { EASE } from './ui'
import { lockScroll } from './SmoothScroll'

export default function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove, count } = useCart()
  useEffect(() => {
    lockScroll(open)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.div className="absolute inset-0 bg-ink/70" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="absolute right-0 top-0 h-full w-full max-w-md bg-char text-warm flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.55, ease: EASE }}>
            <div className="flex items-center justify-between px-6 h-20 border-b border-warm/10">
              <h2 className="eyebrow">Your bag ({count})</h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="w-10 h-10 grid place-items-center"><X size={22} strokeWidth={1.5} /></button>
            </div>
            {items.length === 0 ? (
              <div className="flex-1 grid place-items-center text-center px-8">
                <div>
                  <ShoppingBag size={42} strokeWidth={1} className="mx-auto text-gold mb-6" />
                  <p className="font-display text-xl mb-2">Your bag is empty</p>
                  <p className="text-sm opacity-60 mb-8">Find the sound that moves you.</p>
                  <Link to="/shop" onClick={() => setOpen(false)} className="btn btn-yellow">Shop the collection →</Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 divide-y divide-warm/10">
                  {items.map((l) => (
                    <li key={l.slug + l.color} className="flex gap-4 py-5">
                      <img src={l.product.image} alt={l.product.name} className="w-24 h-24 object-cover object-[68%_50%] bg-ink" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link to={`/product/${l.slug}`} onClick={() => setOpen(false)} className="font-display text-sm hover:text-vy">{l.product.name}</Link>
                          <span className="text-sm">{money(l.product.price * l.qty)}</span>
                        </div>
                        <p className="text-xs opacity-60 mt-1">{l.color}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-warm/25">
                            <button aria-label={`Decrease quantity of ${l.product.name}`} onClick={() => setQty(l.slug, l.color, l.qty - 1)} disabled={l.qty <= 1} className="w-9 h-9 grid place-items-center disabled:opacity-30"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm" aria-live="polite">{l.qty}</span>
                            <button aria-label={`Increase quantity of ${l.product.name}`} onClick={() => setQty(l.slug, l.color, l.qty + 1)} className="w-9 h-9 grid place-items-center"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => remove(l.slug, l.color)} className="eyebrow u-link text-[.6rem] opacity-70">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-6 border-t border-warm/10">
                  <div className="flex justify-between mb-1"><span className="eyebrow">Subtotal</span><span className="font-display">{money(subtotal)}</span></div>
                  <p className="text-xs opacity-50 mb-5">Shipping and taxes are calculated at checkout.</p>
                  <Link to="/checkout" onClick={() => setOpen(false)} className="btn btn-yellow w-full justify-center">Checkout →</Link>
                  <button onClick={() => setOpen(false)} className="eyebrow u-link w-full text-center mt-4 opacity-70">Continue shopping</button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
