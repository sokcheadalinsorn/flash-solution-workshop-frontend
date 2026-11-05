import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { useState } from 'react'
export default function ProductCard({ product }) {
  const { addToCart } = useShop()
  const [liked, setLiked] = useState(false)
  return <article className="group">
    <div className="relative overflow-hidden rounded-2xl bg-[#ECEBDD]">
      <Link to={`/products/${product.id}`}><img src={product.imageUrl} alt={product.name} className="aspect-[4/5] w-full bg-white p-5 object-contain transition duration-500 group-hover:scale-[1.03]" /></Link>
      {product.featured && <span className="absolute left-3 top-3 rounded-full bg-[#FBF8F2]/95 px-3 py-1 text-wine text-[10px] font-semibold uppercase tracking-wider">Bestseller</span>}
      <button onClick={() => setLiked(!liked)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#FBF8F2]/95 text-wine shadow-sm transition hover:bg-white" aria-label="Save product"><Heart size={16} fill={liked ? '#71865A' : 'none'} color={liked ? '#71865A' : '#25291F'}/></button>
      <button onClick={() => addToCart(product)} className="absolute bottom-3 left-3 right-3 flex translate-y-3 items-center justify-center gap-2 rounded-full bg-wine py-3 text-xs font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ShoppingBag size={15}/> Add to bag</button>
    </div>
    <div className="pt-4"><p className="text-[10px] uppercase tracking-[.16em] text-muted">{product.brand} · {product.category}</p><Link to={`/products/${product.id}`} className="mt-1 block font-medium text-ink hover:text-wine">{product.name}</Link><p className="mt-2 text-sm">${Number(product.price).toFixed(2)}</p></div>
  </article>
}