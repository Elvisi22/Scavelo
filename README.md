# Scavelo — studio website

Static site, no build step. Deployable on GitHub Pages, Netlify or Cloudflare Pages.

## Files
- `index.html` — the site (lower-case name is required for the root URL to resolve)
- `privacy.html` — privacy notice (fill in the yellow `[placeholders]`)
- `i18n/` — languages: `i18n.js` (the language menu and loader) plus one file per language
- `og.png` — social preview image (1200×630); replace with a branded one when ready
- `robots.txt` and `sitemap.xml` — tell search engines what to crawl; update `lastmod` in the sitemap when the page changes

## Languages
English is written directly in the HTML. Albanian (`sq`), Italian (`it`), German (`de`), French (`fr`) and Spanish (`es`) each live in `i18n/<code>.js`, which a visitor only downloads when they pick that language. The menu remembers the choice, and a link such as `index.html?lang=de` opens straight in that language.

- In each language file, every key is the exact English text on the page and every value is its translation. If you change English copy in the HTML, update that key in every language file; until you do, that one sentence simply stays in English.
- To add a language, copy `sq.js` to `i18n/<code>.js`, translate the values, and add the language to `LANGS` at the top of `i18n/i18n.js`.
- The translations were written with AI assistance; have a native speaker review each language, and a lawyer review the privacy notice, before relying on them.

## Before going live
1. **Contact form** — briefs are sent in the background by [Web3Forms](https://web3forms.com) to `lordofmyland@proton.me`, the inbox its access key was created for. The key is `FORM_KEY` in `index.html`; it is public by design and can only send to that inbox. To send briefs to another inbox, create a new key at web3forms.com with that address and replace `FORM_KEY`.
2. **Domain** — update `canonical`, `og:url` and `og:image` if the domain changes; the site is served from `https://scavelostudio.co.uk/`.
3. **Privacy notice** — complete the legal entity, address, contact email and processors.
4. **Prices** — every price appears in plain text; search for `€` to adjust.
5. **Google** — add the site in Google Search Console (a *Domain* property for `scavelostudio.co.uk`, verified with the DNS record it gives you), submit `https://scavelostudio.co.uk/sitemap.xml`, and request indexing of the home page. The privacy notice is marked `noindex` until its placeholders are filled in.

## Deploy on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / root. The custom domain is set by the `CNAME` file (`scavelostudio.co.uk`); keep it in the repository root, and tick **Enforce HTTPS** under Settings → Pages.
