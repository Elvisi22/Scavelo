# Scavelo — studio website

Single-file static site. Deployable on GitHub Pages, Netlify or Cloudflare Pages.

## Files
- `index.html` — the site (lower-case name is required for the root URL to resolve)
- `privacy.html` — privacy notice (fill in the yellow `[placeholders]`)
- `og.png` — social preview image (1200×630); replace with a branded one when ready

## Before going live
1. **Contact form** — the form delivers nothing until this is done. Create a free form at https://formspree.io and paste its endpoint into `FORM_ENDPOINT` in `index.html`. Alternatively, once you have an inbox, put its address in `CONTACT_EMAIL` and the form opens the visitor's email client instead. With neither set, visitors see a "sending is not switched on yet" message and nothing is sent.
2. **Proof section** — replace the two `href="#"` links with the demo repository and the scope-template / sample-report PDF. Search the file for `EDIT:`.
3. **Domain** — update `canonical`, `og:url` and `og:image` if the site is not served from `https://scavelo.com/`.
4. **Privacy notice** — complete the legal entity, address, contact email and processors.
5. **Prices** — every price appears in plain text; search for `€` to adjust.

## Deploy on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / root. For a custom domain add a `CNAME` file containing `scavelo.com` and point DNS at GitHub Pages.
