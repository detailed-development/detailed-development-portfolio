# Detailed Development LLC — Portfolio

Studio portfolio site for Detailed Development LLC, a Phoenix, AZ software studio.

## Stack

- Vite + React 19
- React Router (home is a full single-page experience; `/work/:slug` and `/privacy` are supplementary routes)
- Plain CSS with custom properties — no UI libraries

## Development

This project uses **pnpm** (not npm):

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Deploying

Static SPA — deploy `dist/` to Vercel, Netlify, or Cloudflare Pages. All three handle the SPA history fallback automatically. For other hosts, rewrite all routes to `/index.html`.

## Structure

- `src/data/work.js` — all portfolio entries (client sites + products). Edit here to add projects.
- `src/pages/` — Home (full SPA), WorkDetail, Privacy
- `src/components/` — section components composed by Home

Screenshots are currently placeholder blocks — swap them by replacing `.work-placeholder` divs with `<img>` tags once real captures are added.
