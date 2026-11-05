import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Search, UserRound, Gift, Truck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useShop } from '../context/ShopContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { cart } = useShop()
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const links = [
    { to: '/', label: 'Home', active: location.pathname === '/' },
    { to: '/shop', label: 'Shop All', active: location.pathname === '/shop' },
    { to: '/about', label: 'About Us', active: location.pathname === '/about' },
    { to: '/contact', label: 'Contact', active: location.pathname === '/contact' },
  ]
  const navClass = active => `relative h-full inline-flex items-center text-sm font-semibold tracking-wide transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:rounded-full after:transition-transform ${active ? 'text-wine after:scale-x-100 after:bg-wine' : 'text-ink/75 after:scale-x-0 after:bg-wine hover:text-wine hover:after:scale-x-100'}`
  return <header className="sticky top-0 z-40 border-b border-line bg-[#FBF8F2]/95 backdrop-blur">
    <div className="hidden items-center justify-center gap-3 bg-wine px-4 py-2.5 text-[11px] font-medium tracking-wide text-white sm:flex">
      <Truck size={15}/><span>Free shipping on orders over $50</span><span className="mx-3 text-white/40">|</span><Gift size={15}/><span>New arrivals: Discover our latest beauty picks</span>
    </div>
    <div className="container-page flex h-[78px] items-center justify-between">
      <Link to="/" className="flex items-center gap-3" aria-label="Lumière Beauty home">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rose"><Sparkles size={19}/></span>
        <span className="flex flex-col leading-[.82]"><span className="font-display text-[31px] tracking-tight text-wine">Lumière</span><span className="mr-1 mt-1 text-right font-display text-[15px] tracking-wide text-wine">Beauty</span></span>
      </Link>
      <nav className="hidden h-full items-center gap-9 md:flex">{links.map(link => <Link key={link.to} to={link.to} aria-current={link.active ? 'page' : undefined} className={navClass(link.active)}>{link.label}</Link>)}</nav>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/shop" aria-label="Search products" className="rounded-full p-2 text-wine transition hover:bg-cream"><Search size={20}/></Link>
        <Link to="/login" aria-label="Account" className="hidden rounded-full p-2 text-wine transition hover:bg-cream sm:block"><UserRound size={20}/></Link>
        <Link to="/cart" aria-label="Shopping bag" className="relative rounded-full p-2 text-wine transition hover:bg-cream"><ShoppingBag size={20}/>{count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[10px] text-white">{count}</span>}</Link>
        <button className="ml-1 rounded-full p-2 text-wine md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {open && <nav className="flex flex-col gap-1 border-t border-line bg-[#FBF8F2] px-6 py-4 md:hidden">{links.map(link => <Link key={link.to} onClick={() => setOpen(false)} to={link.to} className={`rounded-lg px-3 py-3 text-sm ${link.active ? 'bg-cream font-semibold text-wine' : 'text-ink/80'}`}>{link.label}</Link>)}<Link onClick={() => setOpen(false)} to="/login" className="rounded-lg px-3 py-3 text-sm text-ink/80">My Account</Link></nav>}
  </header>
}
