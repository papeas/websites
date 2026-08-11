# Almyro Glyko — website

Static marketing site for Almyro Glyko Creperie, Nicosia. No build step, no
dependencies, no framework. Open `index.html` in a browser and it works.

```
├── index.html          Home
├── menu.html           Full menu
├── assets/css/styles.css
├── assets/js/main.js
├── favicon.svg
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

## Running it locally

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

Use a server rather than opening the file directly — the pages link assets from
the site root (`/assets/...`), which `file://` will not resolve.

## Deploying

Any static host works. Point it at the repository root; there is nothing to
build.

- **Netlify** — drag the folder in, or connect the repo with publish
  directory `.` and no build command.
- **Vercel** — import the repo, framework preset "Other", no build command.
- **GitHub Pages / Cloudflare Pages / plain nginx** — serve the root directory.

Before going live, replace `https://www.almyroglyko.com` in `index.html`,
`menu.html`, `robots.txt` and `sitemap.xml` if the domain differs, and add an
Open Graph image at `assets/img/og.jpg` (1200×630) — the meta tags already
reference it.

## Changing the theme colours

Every colour on the site resolves from four primitives at the top of
`assets/css/styles.css`:

```css
:root {
  --brand-choc:    #3e2415;  /* dark chocolate — logo mark, primary buttons */
  --brand-cream:   #f7eee1;  /* cream — page background */
  --brand-caramel: #d99c4a;  /* caramel — accents, CTA, highlights */
  --brand-berry:   #b4432f;  /* berry red — used sparingly */
}
```

The tints beneath them (`--choc-900` … `--cream-300`, `--caramel-300` …
`--caramel-700`) are the ramp actually referenced by components, and the
semantic layer (`--bg`, `--text`, `--accent`, `--line`, …) maps that ramp onto
roles. To re-theme:

1. Set the four `--brand-*` values to the real logo colours.
2. Update the matching stops in the `--choc-*` / `--cream-*` / `--caramel-*`
   ramps so the light and dark scales stay consistent.
3. Update the hard-coded hexes in three places CSS variables cannot reach:
   `favicon.svg`, the `theme_color` / `background_color` in
   `site.webmanifest`, and the two `<meta name="theme-color">` tags in each
   HTML file.

Check contrast after any change — body text should stay at 4.5:1 or better
against its background in both themes.

## Editing content

**Text and translations.** Every translatable string carries both languages
inline:

```html
<span data-en="Order online" data-el="Παραγγελία online">Order online</span>
```

The element's initial text is the English fallback for when JavaScript does not
run. `main.js` swaps `textContent` to the `data-el` value when the visitor picks
Greek, and remembers the choice in `localStorage`. To add a string, add both
attributes; nothing else is needed.

**Opening hours.** Each location card in `index.html` carries a `data-hours`
attribute that drives the live "Open now / Closed" badge:

```html
<article class="shop" data-hours="mon=x;tue=11:00-23:00;...">
```

Use `x` for a closed day. Ranges that cross midnight (`18:00-01:00`) are handled.
Times are evaluated in the `Asia/Nicosia` timezone, so the badge is correct for
visitors anywhere. The badge is separate from the human-readable `<dl class="hours">`
list — update both, and the `openingHoursSpecification` in the JSON-LD block.

**Menu items.** Plain markup in `menu.html`:

```html
<li class="menu-item">
  <span class="menu-item__name">Black &amp; White<span class="menu-item__flag">Signature</span></span>
  <span class="menu-item__price">€5.40</span>
  <span class="menu-item__desc">Dark and white chocolate poured side by side.</span>
</li>
```

The section nav and scrollspy pick up new sections automatically as long as the
`<section class="menu-group" id="…">` id matches the `href` in `.menu-nav`.

## What is in the box

- Light/dark theming — follows the system preference, with a manual override
  stored in `localStorage` and applied before first paint so there is no flash.
- Bilingual EN/EL toggle over the same markup.
- Live open/closed badge per location.
- Mobile drawer with a focus trap, `Escape` to close, and scroll lock.
- Scroll reveals and the marquee both respect `prefers-reduced-motion`, and the
  reveals are gated behind a `.js` class so content is never hidden when
  scripting fails.
- SEO: per-page title/description, canonical, Open Graph and Twitter cards,
  `Restaurant` JSON-LD for both branches, `Menu` JSON-LD, sitemap and robots.
- Accessibility: semantic landmarks, skip link, labelled navs and controls,
  visible focus rings, no heading-level skips, 44px minimum tap targets.

## Verified

Checked in Chromium at 320 / 390 / 768 / 1024 / 1440 / 1920px — no horizontal
overflow on either page, no console errors, and all content visible with
JavaScript disabled.

## Content accuracy

Addresses and phone numbers come from the business's public listings. **Opening
hours, prices and the individual menu items should be confirmed against the
till before this goes live** — public sources disagreed on hours, and the item
list is representative rather than transcribed from the current board.
