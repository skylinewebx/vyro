import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Music2 } from 'lucide-react'
import { Logo, Reveal } from './ui'

export function NewsletterForm({ className = '' }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Please enter a valid email address.'); return }
    setErr(''); setDone(true)
    try { localStorage.setItem('vyro-newsletter-demo', email) } catch {}
  }
  if (done) return <p role="status" className={`text-sm font-semibold ${className}`}>Thanks — you're on the list. <span className="font-normal opacity-70">(Demo: no email service is connected yet.)</span></p>
  return (
    <form onSubmit={submit} noValidate className={className}>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex border border-ink/60 focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/20">
        <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" autoComplete="email"
          aria-invalid={!!err} aria-describedby={err ? 'nl-err' : undefined} className="flex-1 min-w-0 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-ink/55" />
        <button type="submit" aria-label="Subscribe" className="bg-ink text-vy px-5 text-lg hover:bg-char transition-colors">→</button>
      </div>
      {err && <p id="nl-err" role="alert" className="text-xs mt-2 font-semibold">{err}</p>}
    </form>
  )
}

const svg = (d) => (p) => <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>{d}</svg>
const Instagram = svg(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>)
const Twitter = svg(<><path d="M4 4l16 16M20 4L4 20" /></>)
const Youtube = svg(<><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9.5v5l4.5-2.5z" /></>)

const cols = [
  { h: 'Shop', l: [['Headphones', '/shop/headphones'], ['Earbuds', '/shop/earbuds'], ['Accessories', '/shop/accessories'], ['Shop all', '/shop']] },
  { h: 'Support', l: [['Contact', '/contact'], ['Shipping', '/contact'], ['Returns', '/contact'], ['FAQs', '/contact']] },
  { h: 'Company', l: [['About', '/about'], ['Journal', '/journal'], ['Contact', '/contact']] },
]

export default function Footer() {
  const top = () => (window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))
  return (
    <footer className="bg-vy text-ink on-yellow">
      <div className="px-5 md:px-10 pt-16 md:pt-24 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1.4fr_auto]">
          <Reveal>
            <Logo className="text-5xl" />
            <p className="mt-4 text-sm max-w-[16rem] leading-relaxed">Premium audio. For a higher tomorrow.</p>
          </Reveal>
          <div className="grid grid-cols-3 gap-6">
            {cols.map((c) => (
              <nav key={c.h} aria-label={c.h}>
                <h3 className="eyebrow mb-5">{c.h}</h3>
                <ul className="space-y-3 text-sm">
                  {c.l.map(([t, to]) => <li key={t}><Link to={to} className="u-link">{t}</Link></li>)}
                </ul>
              </nav>
            ))}
          </div>
          <div>
            <h3 className="eyebrow mb-5">Join our newsletter</h3>
            <p className="text-sm mb-4">Updates on new arrivals and exclusive offers.</p>
            <NewsletterForm />
            <div className="flex gap-5 mt-6">
              {[[Instagram, 'Instagram'], [Twitter, 'X'], [Youtube, 'YouTube'], [Music2, 'TikTok']].map(([I, n]) => (
                <a key={n} href="#" onClick={(e) => e.preventDefault()} aria-label={`${n} (placeholder link)`} className="hover:-translate-y-0.5 transition-transform"><I /></a>
              ))}
            </div>
          </div>
          <button onClick={top} className="group self-start justify-self-start lg:justify-self-end flex flex-col items-center gap-2 eyebrow text-[.6rem]" aria-label="Back to top">
            <span className="w-12 h-12 rounded-full border border-ink grid place-items-center group-hover:bg-ink group-hover:text-vy transition-colors"><ArrowUp size={18} /></span>
            Back to top
          </button>
        </div>
        <div className="mt-14 pt-6 border-t border-ink/40 flex flex-wrap gap-4 justify-between text-xs">
          <p>© {new Date().getFullYear()} VYRO. All rights reserved. Demo store — no live payments.</p>
          <p className="flex gap-5"><Link to="/contact" className="u-link">Privacy Policy</Link><span aria-hidden>|</span><Link to="/contact" className="u-link">Terms of Service</Link></p>
        </div>
      </div>
    </footer>
  )
}
