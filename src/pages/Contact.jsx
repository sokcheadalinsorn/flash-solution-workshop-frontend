import { Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function Contact() {
  return <main className="container-page py-16 md:py-24">
    <section className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-rose">We would love to hear from you</p>
      <h1 className="mt-4 font-display text-5xl text-wine md:text-6xl">Get in touch.</h1>
      <p className="mt-5 text-sm leading-7 text-muted">Need help with a product, an order or your beauty routine? Our support team is here to help.</p>
    </section>
    <section className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
      <a href="mailto:LumiereBeauty@gmail.com" className="rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-gold hover:shadow-soft">
        <Mail className="text-rose" size={24}/><h2 className="mt-5 font-display text-2xl text-wine">Email us</h2>
        <p className="mt-3 break-all text-sm font-semibold text-rose">LumiereBeauty@gmail.com</p>
        <p className="mt-2 text-xs leading-6 text-muted">Send us your questions and we will be happy to assist.</p>
      </a>
      <article className="rounded-2xl border border-line bg-white p-7">
        <Clock className="text-sage" size={24}/><h2 className="mt-5 font-display text-2xl text-wine">24/7 Support</h2>
        <p className="mt-3 text-sm font-semibold text-sage">Available 24 hours a day</p>
        <p className="mt-2 text-xs leading-6 text-muted">Our customer support is available around the clock, every day.</p>
      </article>
      <article className="rounded-2xl border border-line bg-white p-7">
        <MessageCircle className="text-gold" size={24}/><h2 className="mt-5 font-display text-2xl text-wine">We're here to help</h2>
        <p className="mt-3 text-sm font-semibold text-ink">Product and order enquiries</p>
        <p className="mt-2 text-xs leading-6 text-muted">Contact us by email for help with products, orders and general questions.</p>
      </article>
    </section>
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-cream p-6 text-center">
      <p className="font-display text-2xl text-wine">A little care goes a long way.</p>
      <p className="mt-2 text-sm leading-6 text-muted">Lumière Beauty customer care is available 24/7.</p>
    </div>
  </main>
}
