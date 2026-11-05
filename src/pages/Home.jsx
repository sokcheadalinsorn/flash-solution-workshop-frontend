import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Truck, ShieldCheck, Headphones, Sparkles } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'

const categories = [
  { name: 'Skincare', image: '/images/serum.svg', tone: 'bg-[#ECEBDD]', description: 'Daily rituals, thoughtfully chosen' },
  { name: 'Makeup', image: '/images/blush.svg', tone: 'bg-[#E4E8D5]', description: 'Color that feels like you' },
  { name: 'Beauty Tools', image: '/images/fragrance.svg', tone: 'bg-[#F0EFE3]', description: 'The finishing touches' },
]

export default function Home() {
  const { products } = useShop()
  const featured = products.filter(p => p.status === 'Active').slice(0, 4)
  return <>
    <section className="hero-luxe relative overflow-hidden">
      <div className="container-page relative z-10 grid min-h-[540px] items-center gap-8 py-14 md:grid-cols-[.92fr_1.08fr] md:py-12">
        <div className="max-w-xl py-4">
          <p className="eyebrow text-sage">Lumière Beauty</p>
          <h1 className="mt-5 font-display text-[48px] leading-[1.04] tracking-tight text-wine md:text-[66px]">Discover<br/>Your Natural <em className="font-normal text-rose">Glow.</em></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/80 md:text-lg">Premium skincare and makeup for healthy, radiant, and confident beauty.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary rounded-lg px-7 py-4">Shop Now <ArrowRight size={17}/></Link>
            <Link to="/about" className="btn-outline rounded-lg px-6 py-4">Our story</Link>
          </div>
          <div className="mt-9 flex items-center gap-2 text-xs font-medium tracking-wide text-sage"><Leaf size={17}/> BEAUTY, THOUGHTFULLY CHOSEN</div>
        </div>
        <div className="relative mx-auto w-full max-w-[610px]">
          <div className="absolute -inset-5 rounded-[48%_48%_20px_20px] border border-gold/60"></div>
          <div className="relative overflow-hidden rounded-[48%_48%_18px_18px] bg-[#E4E8D5] shadow-luxe">
            <img src="/images/hero.svg" alt="Lumière Beauty skincare and makeup collection" className="aspect-[5/4] w-full object-cover"/>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-xl border border-line bg-[#FBF8F2]/95 px-5 py-3 shadow-soft md:left-2"><p className="eyebrow text-sage">The daily edit</p><p className="mt-1 font-display text-xl text-wine">A little luxury, every day.</p></div>
          <span className="absolute -right-2 top-8 h-14 w-14 rounded-full border border-gold/70 bg-[#F0F1E8]/70 md:-right-4"></span>
        </div>
      </div>
      <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#E4E8D5]/30 blur-3xl"></div>
      <div className="absolute -bottom-28 left-[38%] h-72 w-72 rounded-full bg-[#E4E8D5]/55 blur-3xl"></div>
    </section>
    <section className="border-y border-line bg-[#FBF8F2]">
      <div className="container-page grid grid-cols-2 gap-5 py-6 md:grid-cols-4 md:gap-3">
        {[ [Leaf,'100% Authentic','Genuine products, guaranteed'], [Truck,'Fast Delivery','Get your order quickly'], [ShieldCheck,'Secure Payment','Safe and trusted checkout'], [Headphones,'Friendly Support',"We're here to help"] ].map(([Icon,title,desc])=><div key={title} className="flex items-center gap-3 border-line px-1 md:justify-center md:border-r last:border-0"><Icon className="shrink-0 text-sage" size={27} strokeWidth={1.6}/><div><p className="text-sm font-bold text-wine">{title}</p><p className="mt-1 text-[11px] text-muted">{desc}</p></div></div>)}
      </div>
    </section>
    <section className="container-page py-16 md:py-20">
      <div className="flex items-end justify-between"><div><p className="eyebrow text-sage">Find your favourites</p><h2 className="mt-3 font-display text-4xl text-wine md:text-5xl">Shop by Category</h2></div><Link to="/shop" className="hidden items-center gap-2 text-sm font-semibold text-wine hover:text-rose md:flex">View all <ArrowRight size={16}/></Link></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{categories.map(item=><Link key={item.name} to={`/shop?category=${encodeURIComponent(item.name)}`} className={`category-tile group relative overflow-hidden rounded-2xl ${item.tone}`}><img src={item.image} alt={item.name} className="h-[190px] w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#FBF8F2]/90 px-5 py-4 backdrop-blur-sm"><div><p className="font-display text-2xl text-wine">{item.name}</p><p className="mt-1 text-[11px] text-muted">{item.description}</p></div><span className="grid h-9 w-9 place-items-center rounded-full bg-rose text-white"><ArrowRight size={17}/></span></div></Link>)}</div>
    </section>
    <section className="bg-[#ECEBDD] py-16 md:py-20">
      <div className="container-page flex items-end justify-between"><div><p className="eyebrow text-sage">The Lumière edit</p><h2 className="mt-3 font-display text-4xl text-wine md:text-5xl">Beauty worth discovering</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted">Explore considered favourites from the brands you love.</p></div><Link to="/shop" className="hidden items-center gap-2 text-sm font-semibold text-wine md:flex">Shop all <ArrowRight size={16}/></Link></div>
      <div className="container-page mt-9 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4">{featured.map(p=><ProductCard key={p.id} product={p}/>)}</div>
      <div className="container-page mt-8 text-center md:hidden"><Link to="/shop" className="btn-outline">Explore all products</Link></div>
    </section>
    <section className="container-page grid items-center gap-8 py-16 md:grid-cols-2 md:py-20">
      <div><p className="eyebrow text-sage">A softer routine</p><h2 className="mt-3 font-display text-4xl leading-tight text-wine md:text-5xl">Make space for<br/><em className="font-normal text-rose">yourself.</em></h2><p className="mt-4 max-w-md text-sm leading-7 text-muted">From everyday skincare to the finishing touch, find products that make your daily ritual feel special.</p><Link to="/about" className="btn-primary mt-7 rounded-lg">Discover our story <ArrowRight size={16}/></Link></div>
      <div className="grid grid-cols-2 gap-4"><img src="/images/cleanser.svg" alt="Skincare essentials" className="h-64 w-full rounded-2xl bg-cream object-cover"/><img src="/images/blush.svg" alt="Makeup essentials" className="mt-9 h-64 w-full rounded-2xl bg-blush object-cover"/></div>
    </section>
    <section className="border-y border-line bg-[#FBF8F2] py-16 md:py-20">
      <div className="container-page text-center">
        <p className="eyebrow text-sage">A world of beauty</p>
        <h2 className="mt-3 font-display text-3xl text-wine md:text-4xl">Your favourite brands, all in one place</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">Discover carefully selected beauty essentials from the names you love.</p>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {[
            ['Dior','DIOR'],['Rare Beauty','rare beauty'],['Fenty Beauty','FENTY'],['The Ordinary','The Ordinary'],['CeraVe','CeraVe'],['Laneige','LANEIGE']
          ].map(([name, wordmark]) => <Link key={name} to={`/shop?brand=${encodeURIComponent(name)}`} className="group flex min-h-[104px] flex-col items-center justify-center rounded-2xl border border-line bg-[#F5F3E9] px-3 py-5 transition duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white hover:shadow-soft">
            <span className={`font-display text-xl tracking-wide text-ink/70 transition group-hover:text-wine ${name === 'Fenty Beauty' ? 'font-sans text-base font-semibold tracking-[.18em]' : ''} ${name === 'Laneige' ? 'font-sans text-lg font-semibold tracking-[.12em]' : ''}`}>{wordmark}</span>
            <span className="mt-2 text-[9px] font-semibold uppercase tracking-[.18em] text-sage">{name}</span>
          </Link>)}
        </div>
      </div>
    </section>
  </>
}
