export const initialProducts = [
  { id: 'P-1001', name: 'Capture Youth Glow Booster Serum', brand: 'Dior', category: 'Skincare', price: 92, stock: 18, status: 'Active', featured: true, imageUrl: '/images/serum.svg', description: 'Sample luxury skincare serum listing for the cosmetics shop catalogue.' },
  { id: 'P-1002', name: 'Soft Pinch Liquid Blush', brand: 'Rare Beauty', category: 'Makeup', price: 25, stock: 34, status: 'Active', featured: true, imageUrl: '/images/blush.svg', description: 'Sample cream blush listing with a lightweight, blendable finish.' },
  { id: 'P-1003', name: 'Pro Filt’r Soft Matte Foundation', brand: 'Fenty Beauty', category: 'Makeup', price: 40, stock: 22, status: 'Active', featured: true, imageUrl: '/images/foundation.svg', description: 'Sample foundation listing for exploring shade and stock management.' },
  { id: 'P-1004', name: 'Rouge Dior Lipstick', brand: 'Dior', category: 'Makeup', price: 46, stock: 15, status: 'Active', featured: false, imageUrl: '/images/lipstick.svg', description: 'Sample lip colour listing in the makeup collection.' },
  { id: 'P-1005', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'Skincare', price: 14, stock: 50, status: 'Active', featured: false, imageUrl: '/images/serum.svg', description: 'Sample active-skincare product listing.' },
  { id: 'P-1006', name: 'Hydrating Facial Cleanser', brand: 'CeraVe', category: 'Skincare', price: 18, stock: 29, status: 'Active', featured: false, imageUrl: '/images/cleanser.svg', description: 'Sample gentle facial cleanser listing.' },
  { id: 'P-1007', name: 'Gloss Bomb Lip Gloss', brand: 'Fenty Beauty', category: 'Makeup', price: 23, stock: 0, status: 'Draft', featured: false, imageUrl: '/images/lipstick.svg', description: 'Sample lip gloss listing, currently saved as a draft.' },
  { id: 'P-1008', name: 'Miss Dior Eau de Parfum', brand: 'Dior', category: 'Fragrance', price: 115, stock: 8, status: 'Active', featured: false, imageUrl: '/images/fragrance.svg', description: 'Sample fragrance listing for the beauty catalogue.' },
  { id: 'P-1009', name: 'Relief Sun: Rice + Probiotics SPF50+', brand: 'Beauty of Joseon', category: 'Skincare', price: 19, stock: 41, status: 'Active', featured: true, imageUrl: '/images/sunscreen.svg', description: 'Sample daily sunscreen listing.' },
  { id: 'P-1010', name: 'Lip Sleeping Mask', brand: 'Laneige', category: 'Skincare', price: 24, stock: 26, status: 'Active', featured: false, imageUrl: '/images/cream.svg', description: 'Sample overnight lip-care product listing.' }
]
export const categories = ['All', 'Skincare', 'Makeup', 'Haircare', 'Body', 'Fragrance']
export const brands = ['All', ...new Set(initialProducts.map(product => product.brand))]
