# Halaflora

*The Sweetness of Every Bloom.* An editorial, boutique-florist storefront built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion and Lenis.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your Unsplash key
npm run dev
```

Open <http://localhost:3000>.

## Getting your Unsplash key

1. Create a free account at <https://unsplash.com/join>.
2. Go to <https://unsplash.com/oauth/applications> and click **New Application**. Accept the API guidelines.
3. Open the new app and copy the **Access Key** (not the Secret Key).
4. Paste it into `.env.local`:

   ```
   UNSPLASH_ACCESS_KEY=your_access_key
   ```

The key is only ever read on the server (`process.env`, no `NEXT_PUBLIC_` prefix), so it is never sent to the browser.

### Rate limits

Demo apps are limited to **50 requests/hour**. Halaflora is built to stay far below that:

- One search request per flower type (`rose bouquet`, `peony`, `tulips`, `wildflowers`, `flower arrangement`, `ranunculus`, `dried flowers`) plus one for the hero: about **8 requests** in total.
- Each response holds 20 photos and is shared by every page and section, so the shop, product pages and home page all reuse it.
- Results are cached for **24 hours** with `use cache` (`lib/unsplash.ts`).
- Failed requests (missing key, rate limit, network error) are cached for only a minute, and the site shows elegant illustrated placeholders in the meantime. Nothing crashes.

When you go to production, apply for **Production** access in the Unsplash dashboard to raise the limit. Photographer attribution ("Photo by X on Unsplash") is shown on images and listed under *Photo credits* in the footer, as the Unsplash guidelines require.

## Project structure

```
app/                    routes: /, /shop, /shop/[slug], OG image, icon
components/             UI: Logo, Loader, Hero, Cursor, Cart, Navbar, Footer…
components/sections/    home-page sections
lib/unsplash.ts         typed, cached Unsplash client (server only)
lib/bank.ts             shares photo pools across sections and products
lib/products.ts         product catalogue (edit this to change the shop)
```

## Notes

- Studio contact details, hours and social handles live in `lib/site.ts` (placeholders). FAQ answers in `components/contact/Faq.tsx` and the About page copy are sample text too.
- Testimonials, the `@halaflora` Instagram link, social links and product data are sample content. Replace them with your own.
- The cart is client-side (saved in `localStorage`). Checkout is a stub.
- Animations respect `prefers-reduced-motion`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `UNSPLASH_ACCESS_KEY` | Recommended | Server-side Unsplash key. Without it the site shows illustrated placeholders. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Public origin, e.g. `https://halaflora.com`. Drives `metadataBase`, canonical URLs, Open Graph, `sitemap.xml` and `robots.txt`. Falls back to Vercel's production URL, then `http://localhost:3000`. |

`.env.local` is git-ignored; `.env.example` lists every variable with empty values.

## Deploying to Vercel

1. **Push to GitHub** (see below) and sign in at <https://vercel.com>.
2. **Add New → Project**, import the `halaflora` repository. Vercel detects Next.js; leave the build settings as they are.
3. Under **Environment Variables**, add:
   - `UNSPLASH_ACCESS_KEY` = your Unsplash Access Key
   - `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://halaflora.com`, or the `*.vercel.app` URL until you have a domain)
4. Click **Deploy**. The first build fetches about 12 Unsplash searches, which are cached for 24 hours and shared by every page.
5. **Custom domain (optional):** Project → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL` to match and redeploy so canonical and Open Graph URLs use it.
6. **Before going live:** apply for *Production* access in the Unsplash dashboard (demo keys allow 50 requests/hour), replace the placeholder studio details in `lib/site.ts`, and review the sample copy (FAQ, testimonials, About).

If a build ever runs without a working Unsplash key, pages are generated with placeholders and refresh themselves within a minute once the key works, so no redeploy is needed.

Useful commands:

```bash
npm run build   # production build
npm start       # serve the production build locally
npm run lint
npx tsc --noEmit
```
