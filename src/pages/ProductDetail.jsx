import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react'
import { useShop } from '../context/ShopContext'
export default function ProductDetail() {
  const { id } = useParams()
  const { products, addToCart } = useShop()
  const product = products.find(p=>p.id===id)
  if (!product) return <div className="container-page py-24 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link className="btn-outline mt-6" to="/shop">Back to shop</Link></div>
  return <main className="container-page py-12"><Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft size={15}/> Back to shop</Link><div className="grid gap-12 md:grid-cols-2"><img src={product.imageUrl} alt={product.name} className="aspect-[4/5] w-full rounded-2xl bg-white p-8 object-contain"/><div className="py-5"><p className="eyebrow text-rose">{product.brand} · {product.category}</p><h1 className="mt-4 font-display text-4xl md:text-5xl">{product.name}</h1><p className="mt-5 text-xl">${Number(product.price).toFixed(2)}</p><p className="mt-6 leading-7 text-muted">{product.description}</p><p className="mt-6 flex items-center gap-2 text-xs text-muted"><Check size={15} className="text-green-700"/>{product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}</p><button disabled={product.stock===0} onClick={()=>addToCart(product)} className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40"><ShoppingBag size={16}/> Add to bag</button><div className="mt-8 border-t border-line pt-6 text-sm leading-7 text-muted"><p>Thoughtfully selected for your everyday routine.</p><p>For product ingredients and usage guidance, refer to the product packaging.</p></div></div></div></main>
}