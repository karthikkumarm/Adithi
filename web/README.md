# Adithi – Cross-platform Credit Card Swiping App (Web)

Apple-inspired Next.js 14 app with Owner and Retailer roles, glass morphism UI, and smooth animations.

## Tech
- Next.js 14 App Router, TypeScript strict
- Tailwind CSS custom theme, framer-motion
- Zustand for client auth state, demo JWT

## Getting Started
1. Install deps
```bash
npm i
```
2. Run dev server
```bash
npm run dev
```
3. Visit `http://localhost:3000`

## Demo Credentials
- Owner: `owner@demo.com` / `demo123`
- Retailer: `retailer@demo.com` / `demo123`

## Scripts
- `dev` – start dev server
- `build` – production build
- `start` – run production server

## Env
Create `.env.local` (template):
```
NEXT_PUBLIC_APP_NAME=Adithi
```

## Notes
- API routes return demo data for transactions and a mock token for auth. Replace with real backend and JWT.

