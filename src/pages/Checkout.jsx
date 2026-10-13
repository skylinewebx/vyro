import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { money } from '../data/products'
import { payments } from '../lib/payments'

export default function Checkout() {
  const { items, subtotal, clear, setQty, remove } = useCart()
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '', zip: '' })
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email.'
    ;['name', 'address', 'city', 'zip'].forEach((k) => { if (!form[k].trim()) er[k] = 'Required.' })
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true); setMsg('')
    if (payments.configured) {
      try { const s = await payments.createCheckoutSession({ items, email: form.email }); window.location.href = s.url } catch (x) { setMsg(x.message); setBusy(false) }
      return
    }
    // DEMO MODE: no payment is taken and nothing is sent anywhere.
    setTimeout(() => { setOrder({ id: 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(), total: subtotal, n: items.length }); clear(); setBusy(false) }, 700)
  }

  if (order) {
    return (
      <div className="min-h-screen pt-40 px-5 md:px-10 pb-24 max-w-2xl">
        <p className="eyebrow text-gold mb-4">Demo order</p>
        <h1 className="h-sec mb-6">Thank you.</h1>
        <p className="opacity-80 leading-relaxed">Demo order <strong className="text-vy">{order.id}</strong> was recorded for {money(order.total)}. <strong>No payment was processed and no order was placed.</strong> Connect a payment provider in <code>src/lib/payments.js</code> to go live.</p>
        <Link to="/shop" className="btn btn-yellow mt-10">Continue shopping →</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-5 md:px-10 pb-24">
        <h1 className="h-sec mb-4">Your bag is empty</h1>
        <p className="opacity-70 mb-8">Add something to your bag to check out.</p>
        <Link to="/shop" className="btn btn-yellow">Shop the collection →</Link>
      </div>
    )
  }

  const field = (k, label, type = 'text', auto) => (
    <div key={k}>
      <label htmlFor={`f-${k}`} className="eyebrow text-[.62rem] block mb-2">{label}</label>
      <input id={`f-${k}`} type={type} autoComplete={auto} value={form[k]} onChange={set(k)} className="field" aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `e-${k}` : undefined} />
      {errors[k] && <p id={`e-${k}`} role="alert" className="text-xs text-vy mt-1">{errors[k]}</p>}
    </div>
  )

  return (
    <div className="pt-28 md:pt-36 px-5 md:px-10 pb-24">
      <h1 className="h-sec !text-[clamp(1.8rem,4vw,3rem)] mb-8">Checkout</h1>
      <div className="flex gap-3 items-start bg-vy text-ink p-4 mb-10 max-w-3xl text-sm font-medium">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p><strong>Demo checkout.</strong> No payment provider is connected, so no card is charged and no real order is created. Do not enter real payment details.</p>
      </div>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
        <form onSubmit={submit} noValidate className="space-y-5 max-w-xl">
          <h2 className="eyebrow text-gold">Contact &amp; delivery</h2>
          {field('email', 'Email', 'email', 'email')}
          {field('name', 'Full name', 'text', 'name')}
          {field('address', 'Address', 'text', 'street-address')}
          <div className="grid grid-cols-2 gap-4">{field('city', 'City', 'text', 'address-level2')}{field('zip', 'Postal code', 'text', 'postal-code')}</div>
          <div className="border border-dashed border-warm/25 p-4 text-sm opacity-70">Payment: placeholder — a provider (e.g. hosted checkout) plugs in here.</div>
          {msg && <p role="alert" className="text-vy text-sm">{msg}</p>}
          <button className="btn btn-yellow" disabled={busy}>{busy ? 'Placing demo order…' : `Place demo order — ${money(subtotal)}`}</button>
        </form>
        <aside aria-label="Order summary" className="bg-char p-6 h-fit">
          <h2 className="eyebrow text-gold mb-5">Order summary</h2>
          <ul className="divide-y divide-warm/10">
            {items.map((l) => (
              <li key={l.slug + l.color} className="flex gap-4 py-4">
                <img src={l.product.image} alt="" className="w-16 h-16 object-cover object-[68%_50%] bg-ink" />
                <div className="flex-1 text-sm">
                  <p className="font-display">{l.product.name}</p><p className="opacity-60 text-xs">{l.color}</p>
                  <div className="flex gap-3 items-center mt-2 text-xs">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.color, l.qty - 1)} disabled={l.qty <= 1} className="w-6 h-6 border border-warm/30 disabled:opacity-30">−</button>{l.qty}
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty(l.slug, l.color, l.qty + 1)} className="w-6 h-6 border border-warm/30">+</button>
                    <button type="button" onClick={() => remove(l.slug, l.color)} className="u-link ml-2 opacity-70">Remove</button>
                  </div>
                </div>
                <p className="text-sm">{money(l.qty * l.product.price)}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-5 border-t border-warm/10"><span className="eyebrow">Subtotal</span><span className="font-display">{money(subtotal)}</span></div>
          <p className="text-xs opacity-50 mt-2">Shipping and tax are not calculated in the demo.</p>
        </aside>
      </div>
    </div>
  )
}
