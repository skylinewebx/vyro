import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { bySlug } from '../data/products'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)
const KEY = 'vyro-cart-v1'

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch {} }, [lines])

  const add = useCallback((slug, color, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.slug === slug && l.color === color)
      if (i > -1) return ls.map((l, j) => (j === i ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
      return [...ls, { slug, color, qty }]
    })
    setOpen(true)
  }, [])
  const setQty = useCallback((slug, color, qty) =>
    setLines((ls) => ls.map((l) => (l.slug === slug && l.color === color ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l))), [])
  const remove = useCallback((slug, color) => setLines((ls) => ls.filter((l) => !(l.slug === slug && l.color === color))), [])
  const clear = useCallback(() => setLines([]), [])

  const items = useMemo(() => lines.map((l) => ({ ...l, product: bySlug(l.slug) })).filter((l) => l.product), [lines])
  const count = items.reduce((n, l) => n + l.qty, 0)
  const subtotal = items.reduce((n, l) => n + l.qty * l.product.price, 0)

  return <Ctx.Provider value={{ items, count, subtotal, add, setQty, remove, clear, open, setOpen }}>{children}</Ctx.Provider>
}
