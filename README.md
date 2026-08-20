# Anafi — Handmade Bags

Website for [@anafi.bags_](https://www.instagram.com/anafi.bags_/), a handmade
crochet bag brand based in Cyprus.

Plain HTML, CSS and JavaScript — no build step, no dependencies, no framework.
Open `index.html` in a browser and it works.

```
index.html              the whole page
assets/css/styles.css   all styling
assets/js/main.js       nav, filters, quick-look modal, scroll reveal
assets/img/*.svg        logo + placeholder imagery (see below)
```

## What's real and what isn't

The site was built from the public Instagram profile. Some of it is the brand's
own words and facts; the rest is a stand-in that needs the owner's input.

### ✅ Taken from the real account — safe to keep

- The brand story, quoted from the pinned post: *"named after a small island in
  Greece, a symbol of beauty, simplicity and authenticity… handmade isn't just a
  product, it's a story."*
- 100% handmade · based in Cyprus · established August 2025
- Owner credit — [@kyriaki.hadjisolomi](https://www.instagram.com/kyriaki.hadjisolomi/)
- **Mystery Box, €30** — 1 handmade crochet bag, 2–4 cute surprises, 1 brand
  goodie, a little extra joy. *"Every box is different. Every box is special."*
- The *Crochet your own bag* workshop, and appearances at markets and festivals
  (most recently the Seaside Street Food Festival, Trimiklini village)
- Ordering by Instagram DM
- Instagram and TikTok links

### ⚠️ Placeholder — replace before launch

| What | Where | Notes |
| --- | --- | --- |
| **All 12 images** | `assets/img/*.svg` | Drawn stand-ins, not photos |
| **Logo** | `assets/img/logo.svg` | An approximation of the striped circular logo. Export the real one from Instagram and drop it in — keep the filename and it just works |
| **Product names** | the `<article class="card">` blocks | Descriptive guesses (*Shell Purse*, *Mint Stripe Handbag*…) based on the photos on the grid — swap in whatever they're actually called |
| **Product descriptions & materials** | same blocks, `data-desc` / `data-meta` | Written from what the photos show; check the fibre and hardware details are right |
| **Care guide** | `#care` section | General cotton-yarn advice, not the brand's own instructions |
| **Workshop details** | `#workshops` | Deliberately undated — add the real date when one is scheduled |
| **Stats** | story section `.stats` | 100% / 2025 / Cyprus — all true, but swap in bags-sold or similar if you'd rather |

**Prices are intentionally left out.** Every bag says "DM for price" and the FAQ
points to the price list in the Instagram highlights, which is how the shop
actually works. If you'd rather show prices, add a `data-price` to each card and
put the figure in `.card-price`.

**The FAQ deliberately avoids specifics on delivery costs, payment methods and
returns** — those are in the "Our policy" highlight and weren't readable from
outside. The FAQ points people there instead of guessing. Fill in the real terms
before launch if you want them on the page; they're legally meaningful.

## Swapping in real photos

Drop images into `assets/img/` and update the `src` in `index.html`. Each product
appears twice — once in the `<img>` tag, once in the card's `data-img` attribute
(which the quick-look modal reads):

```html
<article class="card" data-category="handbags"
         data-name="Mint Stripe Handbag"
         data-desc="…"
         data-meta="Cotton yarn · Two short handles"
         data-img="assets/img/mint-stripe.jpg">        <!-- modal image -->
  <div class="card-media">
    <img src="assets/img/mint-stripe.jpg" alt="…" …>   <!-- grid image -->
```

Photo tips: shoot **portrait at 4:5** (the same crop Instagram uses), export
around 1000×1250px as JPG or WebP, and keep the backdrop consistent across the
set. The existing grid photos on Instagram — bags against palm leaves and pale
stone — already do this well.

## Adding or removing a bag

Copy any `<article class="card">…</article>` block and edit it. The
`data-category` must be one of `totes`, `handbags`, `clutches`, `pouches` —
that's what the filter buttons match on. To add a category, add a matching
`<button class="filter" data-filter="…">` above the grid.

Optional badge on a card, just below the `<img>`:

```html
<span class="tag tag-new">New</span>          <!-- dark teal -->
<span class="tag tag-hot">Favourite</span>    <!-- mint      -->
<span class="tag">Few left</span>             <!-- cream     -->
```

## Changing the look

Colours and fonts live in one block at the top of `assets/css/styles.css`, taken
from the logo — mint stripes, deep teal script, cream ground:

```css
:root {
  --cream:    #fbf8f2;   /* page background   */
  --sea:      #7ec8c2;   /* mint accent       */
  --sea-deep: #2f7d78;   /* logo teal         */
  --sea-ink:  #1d4f4d;   /* dark teal, blocks */
  --gold:     #c6a25c;   /* hardware accents  */
}
```

Fonts are Cormorant Garamond (headings), Jost (body) and Parisienne (the *Anafi*
script), loaded from Google Fonts in `index.html`. All have fallbacks, so the
page still reads well if they fail to load.

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

Sticky header · hero · scrolling marquee · filterable bag grid with quick-look
modal · Mystery Box feature · our story · three-step DM ordering flow ·
workshops & markets · care guide · FAQ accordion · Instagram/TikTok call to
action · footer.

Responsive down to 390px, keyboard accessible (skip link, focus trapping in the
modal, Escape to close), and it honours `prefers-reduced-motion`.
