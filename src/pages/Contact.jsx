import { useState } from 'react'
import { Reveal } from '../components/ui'

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', message: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email.'
    if (f.message.trim().length < 5) er.message = 'Tell us a little more.'
    setErr(er)
    if (!Object.keys(er).length) setSent(true)
  }
  return (
    <div>
      <section className="bg-vy text-ink on-yellow pt-36 md:pt-44 pb-16 px-5 md:px-10">
        <Reveal className="eyebrow mb-5">Support</Reveal>
        <Reveal as="h1" className="h-hero !text-[clamp(2.2rem,8vw,6rem)]">Get in touch</Reveal>
      </section>
      <section className="bg-ink px-5 md:px-10 py-16 min-h-[50vh] grid lg:grid-cols-2 gap-14">
        <div className="max-w-md opacity-80 text-sm leading-relaxed space-y-4">
          <p>Questions about an order, a product or our policies? Send us a note.</p>
          <p className="opacity-70">Demo site: this form validates and confirms on screen but does not send email. Privacy Policy and Terms of Service, shipping and returns copy are placeholders to be supplied by the brand.</p>
        </div>
        {sent ? (
          <p role="status" className="font-display text-xl">Thanks, {f.name.split(' ')[0]} — message noted (demo).</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5 max-w-xl">
            {[['name', 'Name', 'text'], ['email', 'Email', 'email']].map(([k, l, t]) => (
              <div key={k}><label htmlFor={`c-${k}`} className="eyebrow text-[.62rem] block mb-2">{l}</label>
                <input id={`c-${k}`} type={t} value={f[k]} onChange={set(k)} className="field" aria-invalid={!!err[k]} />
                {err[k] && <p role="alert" className="text-xs text-vy mt-1">{err[k]}</p>}</div>
            ))}
            <div><label htmlFor="c-message" className="eyebrow text-[.62rem] block mb-2">Message</label>
              <textarea id="c-message" rows={5} value={f.message} onChange={set('message')} className="field" aria-invalid={!!err.message} />
              {err.message && <p role="alert" className="text-xs text-vy mt-1">{err.message}</p>}</div>
            <button className="btn btn-yellow">Send message →</button>
          </form>
        )}
      </section>
    </div>
  )
}
