# gsab-frontend

Landing page for **GSAB — Google Sheets as a Backend**.

Plain Next.js (App Router) + custom CSS. No Tailwind, minimal dependencies, easy to update.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

Push this folder to a Git repo and import it on [vercel.com](https://vercel.com) — zero config.
Then add the custom domain **gsab.ajmalaksar.com** in the Vercel project's Domains settings.

## Edit

- Copy / sections live in `app/page.jsx`.
- Design system (colours, type, spacing, motion) lives in `app/globals.css` under `:root`.
- Fonts: Fraunces (display), Hanken Grotesk (body), JetBrains Mono (code) via `app/layout.jsx`.
