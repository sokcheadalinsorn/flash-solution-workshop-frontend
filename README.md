# Brief 15 — Lumière Cosmetics Shop

A React + Tailwind CSS front end for the Brief 15 Spring Boot backend API project. It includes a customer storefront and an admin product-management area.

## Requirements
- Node.js 18+
- npm

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```
Open the local URL printed by Vite.

## Build
```bash
npm run build
npm run preview
```

## Pages
### Customer
- `/` — home page and featured products
- `/shop` — product catalogue, search and category filters
- `/products/:id` — product detail
- `/cart` — shopping cart
- `/login` — demo login form
- `/register` — demo registration form
- `/orders` — demo order history

### Admin
- `/admin` — admin dashboard
- `/admin/products` — product list, search, filters and product actions
- `/admin/products/new` — add product form
- `/admin/products/:id/edit` — edit product form

The admin area is included for interface and API analysis. Authentication and authorization are not implemented; the routes are not protected. Add Spring Security and role-based authorization in the backend before using a real admin account.

## Backend integration
The project currently uses local mock data in `src/data/products.js` and browser local storage for the cart. No real backend is connected.

The API service layer is in `src/services/api.js` and uses **Axios with async/await** to communicate with the Java Spring Boot REST API. Set `VITE_API_BASE_URL` in `.env` when the backend is ready. The current storefront still uses sample data and local storage so it can run independently before backend integration. See `docs/AXIOS_ASYNC_AWAIT.md` for teaching examples. Suggested endpoints are documented in `docs/API_REQUIREMENTS.md`.

## Teaching note
The product list and admin CRUD interface are designed to help Junior Backend Developers identify entities, fields, validation rules, API endpoints, HTTP methods, and expected responses. Sample data is illustrative and can be changed by the project team.


Store navigation includes Home, Shop all, About us and Contact. The storefront uses a warm ivory, espresso and champagne-gold palette. The contact page contains demo content; add verified business contact details before publishing.


## Visual identity — Champagne, Rosewood, Sage & Gold

The storefront and admin workspace share one coordinated palette:
- Pearl/champagne `#F8F4EE` for the main canvas and soft surfaces
- Rosewood `#805B50` for primary buttons and active navigation
- Deep wine `#6E3037` for high-emphasis details
- Botanical sage `#65745D` for secondary accents and reassurance icons
- Champagne gold `#C6A46A` for subtle borders and premium details
- Espresso `#302722` for readable headings and body text

The Contact page contains demo placeholders. Add verified business contact details before publishing.


## Version 8 — Complete storefront and admin visual refresh

This version applies the approved Lumière Beauty visual direction throughout the app:
- Champagne/pearl backgrounds and soft blush surfaces
- Rosewood primary buttons, active states and key actions
- Deep wine emphasis for headings and important navigation
- Sage secondary accents for botanical cues
- Champagne-gold borders and decorative details
- Refreshed responsive announcement bar, header, hero, category tiles, reassurance strip and footer
- Coordinated styling across shop, product, cart, checkout, account, About, Contact and admin screens

The existing local SVG product illustrations remain demo assets. Replace them with licensed product photography when preparing a production storefront.


## Contact and Admin User Management (demo)
- Contact email shown in the storefront: LumiereBeauty@gmail.com
- Customer support hours shown: 24/7
- Admin workspace includes a User Management page at `/admin/users` with sample account records, role changes, status changes, and removal.
- User management currently stores demo records in browser localStorage. It does not create real user credentials or enforce access control. Production use requires backend authentication, secure password handling, role-based authorization, and protected admin endpoints.


## Real product images
The demo catalogue now uses product packshot image URLs for the sample products (Dior Capture Youth Glow Booster, Rare Beauty Soft Pinch Liquid Blush, Fenty Beauty Pro Filt'r Foundation, Rouge Dior lipstick, The Ordinary Niacinamide serum, CeraVe Hydrating Facial Cleanser, Miss Dior Eau de Parfum, Beauty of Joseon Relief Sun, and Laneige Lip Sleeping Mask). Product cards, product details, admin thumbnails and homepage featured imagery use these catalogue images. Images are loaded from third-party brand/retailer image hosts, so an image host may change or block external access. For production, obtain permission or use image assets supplied/licensed by the brands or distributors and host them on your own server.


## V19 Sage & Pearl colour correction

The interface uses the Sage & Pearl palette consistently. Purple/lavender theme values from the previous version have been replaced with sage, olive, and warm pearl tones.
