import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
export default function Footer() {
  return <footer className="mt-16 bg-[#25291F] py-14 text-white">
    <div className="container-page grid gap-10 md:grid-cols-[1.4fr_.8fr_1fr]">
      <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#E4E8D5]"><Sparkles size={18}/></span><span className="flex flex-col leading-[.82]"><span className="font-display text-3xl">Lumière</span><span className="mr-1 mt-1 text-right font-display text-sm">Beauty</span></span></div><p className="mt-4 max-w-sm text-sm leading-7 text-white/65">Thoughtful beauty essentials for your everyday ritual. Discover skincare and makeup from the brands you love.</p></div>
      <div><p className="eyebrow text-[#E4E8D5]">Explore</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/75"><Link onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="hover:text-white" to="/shop">Shop all</Link><Link onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="hover:text-white" to="/about">About us</Link><Link onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="hover:text-white" to="/contact">Contact</Link><Link onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="hover:text-white" to="/orders">My orders</Link></div></div>
      <div><p className="eyebrow text-[#E4E8D5]">Customer care</p><p className="mt-5 text-sm leading-7 text-white/65">We're here for you 24 hours a day, 7 days a week.</p><a href="mailto:LumiereBeauty@gmail.com" className="mt-3 inline-block text-sm text-[#E4E8D5] hover:text-white">LumiereBeauty@gmail.com</a><Link onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} to="/admin" className="mt-4 block text-xs text-[#E4E8D5] underline underline-offset-4">Admin portal</Link></div>
    </div>
    <div className="container-page mt-11 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5 text-[11px] text-white/45"><span>© 2026 Lumière Beauty. Demo project.</span><span>Beauty, thoughtfully chosen.</span></div>
  </footer>
}
