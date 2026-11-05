# Suggested API requirements to investigate

These are suggestions inferred from the front-end screens, not confirmed client requirements. The development team should review the UI and agree on the final API contract.

| Feature | Method | Suggested endpoint | Purpose |
|---|---|---|---|
| List products | GET | `/api/products` | Return products, optionally filtered by category/search |
| Product detail | GET | `/api/products/{id}` | Return one product |
| Create product | POST | `/api/products` | Create a product from admin form |
| Update product | PUT | `/api/products/{id}` | Update product details |
| Delete product | DELETE | `/api/products/{id}` | Remove a product |
| List categories | GET | `/api/categories` | Return categories |
| Register | POST | `/api/auth/register` | Create customer account |
| Login | POST | `/api/auth/login` | Authenticate user |
| Cart | GET/POST/PUT/DELETE | `/api/cart` | Read and modify cart |
| Create order | POST | `/api/orders` | Submit checkout |
| Customer orders | GET | `/api/orders/my` | Return current customer's orders |
| Admin orders | GET | `/api/admin/orders` | View all orders (admin only) |

## Product fields shown in the interface
- `id`
- `name`
- `brand`
- `category`
- `price`
- `description`
- `imageUrl`
- `stock`
- `status` (`Active` or `Draft`)
- `featured`

## Questions for the development team
1. Should product deletion be permanent or soft deletion?
2. Should price support discounts and sale prices?
3. Should stock be reduced when an order is placed or paid?
4. Which product fields are required?
5. Should customers browse products without logging in?
6. Which endpoints require customer or admin authorization?
7. What validation and error response format should the API use?

## Multi-brand catalogue
The sample catalogue includes Dior, Rare Beauty, Fenty Beauty, The Ordinary, CeraVe, Beauty of Joseon and Laneige. These are example catalogue entries for training; this demo is not affiliated with or endorsed by those brands. The backend can treat `brand` as product data or model brands as a separate resource.

Suggested endpoints to discuss:
- `GET /api/brands` — list available brands
- `GET /api/products?brand={brand}` — filter products by brand
- `GET /api/products?category={category}` — filter products by category

Product data may include `brand`, `category`, `price`, `stock`, `status`, `featured`, `imageUrl`, and `description`.
