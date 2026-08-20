# Anafi Bags — website

A single-page website for the Anafi Bags Instagram store
([@anafi.bags_](https://www.instagram.com/anafi.bags_/)).

Plain HTML, CSS and JavaScript — no build step, no dependencies, no framework.
Open `index.html` in a browser and it works.

```
index.html              the whole page
assets/css/styles.css   all styling
assets/js/main.js       nav, filters, quick-look modal, scroll reveal
assets/img/*.svg        placeholder imagery (see below)
```

## ⚠️ The content is placeholder — read this first

Instagram blocks automated access, so none of the real shop content could be
pulled in. **Every product, price, photo and policy on the page is invented as a
realistic stand-in** and needs replacing before the site goes live:

| What | Where | Notes |
| --- | --- | --- |
| Product photos | `assets/img/product-01…06.svg` | Line-art placeholders |
| Hero photo | `assets/img/hero.svg` | Portrait crop, roughly 4:5 |
| Story photo | `assets/img/atelier.svg` | Landscape, roughly 4:3 |
| Names, prices, descriptions, sizes | `index.html`, the `<article class="card">` blocks | |
| Delivery times, costs, returns window, payment methods | FAQ + "How to order" sections | **Legally meaningful — check these carefully** |
| "300+ bags delivered", "12 pieces in store" | Story section `.stats` | |
| `hello@anafibags.com` | Contact section + footer | Replace or remove |

The Instagram handle and links are the one thing that *is* real — they all point
at `https://www.instagram.com/anafi.bags_/`.

## Swapping in real photos

Drop your images into `assets/img/` and update the `src` in `index.html`. Each
product appears twice — once in the `<img>` tag, once in the card's `data-img`
attribute (which the quick-look modal reads):

```html
<article class="card" data-category="totes"
         data-name="Kyma Tote" data-price="€58"
         data-desc="…"
         data-meta="38 × 30 × 12 cm · Soft grain leather · Sand, Black, Olive"
         data-img="assets/img/kyma-tote.jpg">          <!-- modal image -->
  <div class="card-media">
    <img src="assets/img/kyma-tote.jpg" alt="Kyma Tote" …>   <!-- grid image -->
```

Photo tips: shoot **portrait at 4:5** (the same crop Instagram uses), export
around 1000×1250px as JPG or WebP, and keep the background consistent across the
set — it's what makes a small collection look considered.

## Adding or removing a product

Copy any `<article class="card">…</article>` block and edit it. The
`data-category` value must be one of `totes`, `shoulder`, `crossbody`,
`evening`, `backpacks` — that's what the filter buttons match on. To add a new
category, add a matching `<button class="filter" data-filter="…">` above the
grid.

Optional badge on a card, just below the `<img>`:

```html
<span class="tag tag-new">New in</span>      <!-- dark  -->
<span class="tag tag-hot">Bestseller</span>  <!-- gold  -->
<span class="tag tag-low">Few left</span>    <!-- light -->
```

## Changing the look

Colours, fonts and spacing all live in one block at the top of
`assets/css/styles.css`:

```css
:root {
  --bone: #faf7f2;   /* page background */
  --ink:  #2f2620;   /* text, buttons   */
  --tan:  #b8895c;   /* accent          */
  --gold: #d8b48a;   /* highlights      */
}
```

Fonts are Cormorant Garamond (headings) and Jost (body), loaded from Google
Fonts in `index.html`. Both have system fallbacks, so the page still reads well
if the fonts fail to load.

## Publishing it

It's a static site, so anything that serves files will do:

- **GitHub Pages** — repo Settings → Pages → deploy from this branch, root folder.
- **Netlify / Vercel** — drag the folder in, or connect the repo; no build
  command, publish directory is the repo root.
- **Any web host** — upload `index.html` and `assets/` over FTP.

To preview locally:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## What's on the page

Sticky header · hero · scrolling category marquee · filterable product grid with
quick-look modal · our story + stats · three-step "how to order" · materials &
care · FAQ accordion · Instagram call-to-action · footer.

Built responsive (single column under 560px), keyboard accessible (skip link,
focus trapping in the modal, Escape to close), and it honours
`prefers-reduced-motion`.
