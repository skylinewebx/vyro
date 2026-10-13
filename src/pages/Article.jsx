import { Link, useParams } from 'react-router-dom'
import { articles } from '../data/journal'
import { Reveal } from '../components/ui'
import NotFound from './NotFound'

export default function Article() {
  const { slug } = useParams()
  const a = articles.find((x) => x.slug === slug)
  if (!a) return <NotFound />
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 2)
  return (
    <article className="pt-32 md:pt-40 pb-24">
      <div className="px-5 md:px-10 max-w-4xl">
        <Link to="/journal" className="eyebrow text-[.62rem] u-link text-gold">← Journal</Link>
        <p className="eyebrow text-vy mt-8 mb-4">{a.tag} · {a.read} read</p>
        <h1 className="h-sec !text-[clamp(1.8rem,4.6vw,3.6rem)]">{a.title}</h1>
      </div>
      <img src={a.image} alt="" className="photo w-full h-[50vh] md:h-[65vh] object-cover mt-10" />
      <div className="px-5 md:px-10 max-w-2xl mt-12 space-y-6 text-lg leading-relaxed opacity-90">
        <p className="text-xl font-medium text-warm">{a.excerpt}</p>
        {a.body.map((p, i) => <Reveal as="p" key={i}>{p}</Reveal>)}
      </div>
      <div className="px-5 md:px-10 mt-20 grid sm:grid-cols-2 gap-6 max-w-4xl">
        {more.map((m) => (
          <Link key={m.slug} to={`/journal/${m.slug}`} className="group border border-gold/20 hover:border-vy p-6 transition-colors">
            <p className="eyebrow text-[.6rem] text-gold mb-2">Keep reading</p>
            <p className="font-display text-sm leading-snug group-hover:text-vy">{m.title}</p>
          </Link>
        ))}
      </div>
    </article>
  )
}
