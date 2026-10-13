import { useState } from 'react'
import { articles } from '../data/journal'
import { ArticleCard } from '../sections/JournalPreview'
import { Reveal } from '../components/ui'

const tags = ['All', ...new Set(articles.map((a) => a.tag))]

export default function Journal() {
  const [tag, setTag] = useState('All')
  const list = articles.filter((a) => tag === 'All' || a.tag === tag)
  return (
    <div>
      <section className="bg-vy text-ink on-yellow pt-36 md:pt-44 pb-14 px-5 md:px-10">
        <Reveal className="eyebrow mb-5">The Journal</Reveal>
        <Reveal as="h1" className="h-hero !text-[clamp(2.2rem,8vw,6rem)]">From our<br />journal</Reveal>
        <Reveal delay={0.1} className="mt-5 max-w-md font-medium">Tips, stories and insights from the world of sound.</Reveal>
      </section>
      <section className="bg-ink px-5 md:px-10 py-14 min-h-[60vh]">
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter articles">
          {tags.map((t) => <button key={t} onClick={() => setTag(t)} aria-pressed={tag === t} className={`eyebrow border px-4 py-2.5 transition-colors ${tag === t ? 'bg-vy text-ink border-vy' : 'border-warm/25 hover:border-vy'}`}>{t}</button>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => <ArticleCard key={a.slug} a={a} i={i} />)}
        </div>
      </section>
    </div>
  )
}
