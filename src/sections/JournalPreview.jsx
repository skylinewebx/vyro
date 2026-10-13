import { Link } from 'react-router-dom'
import { articles } from '../data/journal'
import { SectionHead } from '../components/ui'
import { Reveal } from '../components/ui'

export function ArticleCard({ a, i = 0 }) {
  return (
    <Reveal as="article" delay={(i % 4) * 0.08} className="group relative">
      <Link to={`/journal/${a.slug}`} className="block">
        <div className="aspect-[4/3] sm:aspect-[5/4] overflow-hidden bg-char relative">
          <img src={a.image} alt={a.title} loading="lazy" className="photo w-full h-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="eyebrow text-[.6rem] text-vy mb-2">{a.tag}</p>
            <h3 className="font-display text-[.95rem] leading-snug mb-3">{a.title}</h3>
            <span className="eyebrow text-[.6rem] inline-flex gap-2 group-hover:gap-4 transition-all">Read more →</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export default function JournalPreview() {
  return (
    <section className="bg-ink px-5 md:px-10 py-20 md:py-32 border-t border-gold/10" aria-labelledby="jr-h">
      <SectionHead n="05" title={<span id="jr-h">From our journal</span>} link="/journal">Tips, stories and insights from the world of sound.</SectionHead>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 4).map((a, i) => <ArticleCard key={a.slug} a={a} i={i} />)}
      </div>
    </section>
  )
}
