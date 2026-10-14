# E-Commerce Frontend

Professional React e-commerce frontend for the E-Commerce Laravel API.

## Stack

- **React 19** + TypeScript + Vite
- **Material UI (MUI) v6** — design system & components
- **Lucide React** — icons
- **Swiper** — hero carousels
- **React Router v7** — client-side routing
- **Zustand** — lightweight state (auth, cart, wishlist)
- **Axios** — API client with auth interceptors
- **Notistack** — toast notifications

## Features

- Home with hero slider, categories, bestsellers & sale sections
- Shop with search, category filters, tags, sorting
- Product detail (sizes, colors, qty, wishlist, related)
- Auth (login / register) with Sanctum Bearer tokens
- Cart & checkout (addresses, payment methods, promo codes, shipping)
- Wishlist, Orders history, Notifications
- Profile management, Addresses CRUD, Payment methods
- Fully responsive, polished UI/UX, loading & empty states

## Setup

```bash
cd frontend
npm install
```

Create `.env` (optional):

```
VITE_API_URL=http://localhost:8000/api
```

If omitted, defaults to `http://localhost:8000/api`.  
Vite also proxies `/api` → `http://localhost:8000` in dev.

```bash
npm run dev
```

Open http://localhost:5173

## Demo account

- Email: `alex@example.com`
- Password: `password`

Make sure the Laravel backend is running (`php artisan serve`) and seeded.

## Project structure

```
src/
  api/          Axios client + error helpers
  components/   Header, Footer, ProductCard, Layout, ProtectedRoute...
  pages/        All route pages
  store/        Zustand stores (auth, cart, wishlist)
  theme/        MUI theme (typography, palette, component overrides)
  types/        Shared TypeScript interfaces
```

## Build

```bash
npm run build
npm run preview
```
