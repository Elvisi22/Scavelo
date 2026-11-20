# Scavelo — studio website

Static site, no build step. Deployable on GitHub Pages, Netlify or Cloudflare Pages.

## Files
- `index.html` — the site (lower-case name is required for the root URL to resolve)
- `privacy.html` — privacy notice (fill in the yellow `[placeholders]`)
- `i18n/` — languages: `i18n.js` (the language menu and loader) plus one file per language
- `og.png` — social preview image (1200×630); replace with a branded one when ready

## Languages
English is written directly in the HTML. Albanian (`sq`), Italian (`it`), German (`de`), French (`fr`) and Spanish (`es`) each live in `i18n/<code>.js`, which a visitor only downloads when they pick that language. The menu remembers the choice, and a link such as `index.html?lang=de` opens straight in that language.

- In each language file, every key is the exact English text on the page and every value is its translation. If you change English copy in the HTML, update that key in every language file; until you do, that one sentence simply stays in English.
- To add a language, copy `sq.js` to `i18n/<code>.js`, translate the values, and add the language to `LANGS` at the top of `i18n/i18n.js`.
- The translations were written with AI assistance; have a native speaker review each language, and a lawyer review the privacy notice, before relying on them.

## Before going live
1. **Contact form** — the form delivers nothing until this is done. Create a free form at https://formspree.io and paste its endpoint into `FORM_ENDPOINT` in `index.html`. Alternatively, once you have an inbox, put its address in `CONTACT_EMAIL` and the form opens the visitor's email client instead. With neither set, visitors see a "sending is not switched on yet" message and nothing is sent.
2. **Domain** — update `canonical`, `og:url` and `og:image` if the site is not served from `https://scavelo.com/`.
3. **Privacy notice** — complete the legal entity, address, contact email and processors.
4. **Prices** — every price appears in plain text; search for `€` to adjust.

## Deploy on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / root. For a custom domain add a `CNAME` file containing `scavelo.com` and point DNS at GitHub Pages.
