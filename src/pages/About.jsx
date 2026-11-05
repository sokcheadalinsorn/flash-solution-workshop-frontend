import { Link } from 'react-router-dom'
import { Sparkles, Heart, Leaf } from 'lucide-react'

export default function About() {
  return <main className="container-page py-16 md:py-24">
    <section className="mx-auto max-w-3xl text-center">
      <p className="eyebrow text-rose">Our philosophy</p>
      <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">Beauty should feel like <em className="font-normal text-rose">you.</em></h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">Lumière Beauty brings together a considered edit of skincare and makeup from familiar beauty labels. We believe a beauty routine can be personal, uncomplicated and a small pleasure in your day.</p>
    </section>
    <section className="mt-16 grid gap-5 md:grid-cols-3">
      <article className="rounded-2xl bg-cream p-7"><Sparkles className="text-rose" size={23}/><h2 className="mt-5 font-display text-2xl">A considered edit</h2><p className="mt-3 text-sm leading-7 text-muted">Explore a curated range of products across skincare and makeup, all in one place.</p></article>
      <article className="rounded-2xl bg-cream p-7"><Heart className="text-rose" size={23}/><h2 className="mt-5 font-display text-2xl">Your own ritual</h2><p className="mt-3 text-sm leading-7 text-muted">Find the textures, essentials and everyday favourites that fit your personal routine.</p></article>
      <article className="rounded-2xl bg-cream p-7"><Leaf className="text-rose" size={23}/><h2 className="mt-5 font-display text-2xl">Thoughtful discovery</h2><p className="mt-3 text-sm leading-7 text-muted">Discover established and emerging beauty labels with an easy-to-explore collection.</p></article>
    </section>
    <div className="mt-14 text-center"><Link to="/shop" className="btn-primary">Explore the collection</Link></div>
  </main>
}
