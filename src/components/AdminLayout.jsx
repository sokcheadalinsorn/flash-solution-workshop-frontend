import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Package, Store, ArrowLeft, Sparkles, Users } from 'lucide-react'
export default function AdminLayout() {
  const item = ({isActive}) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-wine text-white shadow-sm' : 'text-ink/65 hover:bg-cream hover:text-wine'}`
  return <div className="min-h-screen bg-[#F5F3E9]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-[#FBF8F2] p-5 lg:block">
      <Link to="/" className="flex items-center gap-3 px-2 py-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rose"><Sparkles size={19}/></span><span className="font-display text-2xl text-wine">Lumière.</span></Link>
      <p className="eyebrow mb-3 mt-10 px-4 text-sage">Workspace</p>
      <nav className="space-y-1"><NavLink end to="/admin" className={item}><LayoutDashboard size={17}/> Overview</NavLink><NavLink to="/admin/products" className={item}><Package size={17}/> Products</NavLink><NavLink to="/admin/users" className={item}><Users size={17}/> User management</NavLink></nav>
      <div className="absolute bottom-6 left-5 right-5"><Link to="/" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-cream hover:text-wine"><ArrowLeft size={16}/> Back to storefront</Link></div>
    </aside>
    <div className="lg:pl-64"><header className="flex h-[76px] items-center justify-between border-b border-line bg-[#FBF8F2] px-6 lg:px-10"><div><p className="text-sm font-semibold text-wine">Admin workspace</p><p className="text-xs text-muted">Lumière Beauty · Demo administration</p></div><Link to="/" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:border-gold hover:text-wine"><Store size={16}/> View store</Link></header><main className="p-5 md:p-9"><Outlet/></main></div>
  </div>
}
