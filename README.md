# ec92a5 — UI portfolio

A React + Vite portfolio with a focused three-dimensional showcase, a full-size project gallery, commission pricing, and terms of service. No backend or paid services required.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy to Vercel

Push this folder to a GitHub repository and import it into Vercel. Select the **Vite** framework preset, use `npm run build` as the build command, and `dist` as the output directory. There are no environment variables. You can add your custom domain in the Vercel project's domain settings later.

## Edit the portfolio

- `src/content.js`: project categories, accessible image descriptions, image paths, FAQs, and terms.
- `src/navigation.jsx`: client-side routes, page transitions, browser history, and scroll restoration.
- `vercel.json`: direct-page URL rewrites for deployment.
- `src/main.jsx`: page layout, pricing, and shared navigation.
- `src/Home.jsx`: homepage profile, services, client reviews, and contact section.
- `src/style.css`: responsive styling, colors, and animation. The accent is your username as a hex color, `#ec92a5`.
- `public/work/`: your original portfolio artwork. Replace the files or add entries in `src/content.js` to expand the gallery.
- `public/pricing-chart.png`: the supplied pricing graphic.
- `index.html`: browser title and search description.

The homepage opens with the designer profile, followed by services, reviews, and contact. The former top showcase has been removed. Shared cursor-following glows respond across sections and cards; navigation stays visible while scrolling.

The site honors reduced-motion preferences, uses native dialogs with keyboard focus containment and Escape-to-close behavior, and supports left/right arrow navigation inside the project gallery. Commission buttons open Discord; there is no fake contact form.

## Content decisions

Your supplied pricing chart shows **4,000+ Robux for design only** and **5,500+ Robux for design + Roblox import**. The page presents those as starting prices per frame. Your written advertisement's 5,500 Robux minimum is reflected in the import package.

The graphic says “Unlimited Revisions,” while your supplied terms specify reasonable revisions and extra charges for major redesigns. The website uses the more precise written terms and places a clarification beside the original graphic. The graphic's 1–2 day estimate is qualified by complexity, availability, and the agreed deadline.

The terms preserve all ten supplied sections, with the services scope broadened beyond Roblox as requested, and explicit clarification of the advertised importing and source-file packages. Confirm pricing, delivery estimates, and commission availability before public launch.

## Artwork sources

X did not expose the profile's images to the available fetcher. The six original, watermarked artworks were retrieved from your matching public RoDevs portfolio instead:

https://rodevs.com/portfolios/763865903284617238

1. `01.jpeg`: https://rodevs.com/media/63a56a8c12254d939ed4c3686f8c282d.jpeg
2. `02.jpeg`: https://rodevs.com/media/4acde786c9734a6c92d7dcb44e2015c0.jpeg
3. `03.jpeg`: https://rodevs.com/media/cd20df8a0a894ba894215de6b96ea342.jpeg
4. `04.jpeg`: https://rodevs.com/media/ffd265afb00542f6bd54a9bd121f6e2d.jpeg
5. `05.jpeg`: https://rodevs.com/media/1baa0ec51a2749cba762b8683accc0d8.jpeg
6. `06.png`: https://rodevs.com/media/f43fdc3344564c9b956546588eff062e.png

Gallery labels show UI categories only. Reference portfolios informed the structure; their artwork, client testimonials, and metrics were not reused.

The site uses Google Fonts with local system fallbacks and Lucide icons. Artwork is served locally, with no dependency on the source portfolio's continued availability.

The engine-name strip has been removed, and the site copy and FAQs now focus on UI design without engine-specific positioning. The original user-supplied pricing chart remains available in its viewer.

## Pages

- `/`: designer profile, services, client reviews, and contact
- `/work`: image gallery
- `/about`: redirects to the homepage
- `/process`: commission steps
- `/pricing`: packages and pricing chart
- `/faq`: commission questions
- `/terms`: all ten Terms of Service sections

Navigation uses real paths with an animated five-panel shutter and a perspective transition. Back/forward navigation restores scroll positions; reduced-motion preferences bypass the animation. Previous section links such as `/#process` are redirected locally to their new page. On Vercel, the included rewrite serves the application for direct page URLs. Other static hosts need an equivalent SPA fallback to `index.html`.

## Adding weekly work

1. Save the image in `public/work/`.
2. Add its `category`, `src`, and accessible `description` at the beginning of the `projects` array in `src/content.js`.

The new work appears in the Work archive. The homepage service examples are linked to their original image paths, so adding new work does not change those examples.

First load uses a staggered navigation entrance, individual title-letter reveals, a perspective showcase entrance, and delayed controls. Directly loaded inner pages also animate their headings and content. The sequence ends after 2.2 seconds, cancels when navigating away, and respects reduced-motion preferences. Existing page-to-page transitions remain separate.

The testimonial cards use the three quotes, names, roles, and five-star ratings supplied by the owner. Add entries to `reviews` in `src/content.js`; the desktop strip repeats automatically. The animation keeps moving on hover and focus; its pause control remains available. Mobile and reduced-motion layouts use a manually scrollable strip. Homepage sections reveal on entry and retain visible content with reduced motion enabled.

The current first-load sequence reveals the profile and facts. Compact testimonial cards preserve the complete supplied quotes. Shared mouse lighting is handled by `src/usePointerGlow.js`, using one requestAnimationFrame loop and respecting reduced-motion preferences.
