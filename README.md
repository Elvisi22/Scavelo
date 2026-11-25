# Scavelo — studio website

Static site, no build step. Deployable on GitHub Pages, Netlify or Cloudflare Pages.

## Files
- `index.html` — the home page (lower-case name is required for the root URL to resolve)
- `web-design/`, `logo-design/`, `online-stores/`, `elasticsearch/`, `api-development/`, `ai-assistants/`, `deployment/`, `ai-review/` — one page per service, each an `index.html`, so the addresses are `/web-design/` and so on
- `404.html` — shown by GitHub Pages for any address that does not exist; it is `noindex`, and every link and file in it starts with `/` so it works at any depth
- `privacy.html` — privacy notice (fill in the yellow `[placeholders]`)
- `assets/site.css` — the styles for every page; `assets/page.js` — the script for the service pages and the 404 page (the home page keeps its own inline script for the proposal tabs and the form); `assets/logo.png` — the square logo Google and phones use
- `i18n/` — languages: `i18n.js` (the language menu and loader) plus one file per language
- `og.png` — social preview image (1200×630) shown when the site is shared; if you change its words, update `og:image:alt` and `twitter:image:alt` in every page to match
- `robots.txt` and `sitemap.xml` — tell search engines what to crawl; the sitemap lists every page, so add new pages to it and update `lastmod` when a page changes
- `llms.txt` — a plain-language summary of the studio, services, prices and how to send a brief, written for AI agents and assistants; keep it in step with the pages

## AI agents
The site is set up for AI agents that browse on someone's behalf (what Lighthouse scores as *Agentic Browsing*):
- `llms.txt` gives them the essentials in one file.
- The contact form carries WebMCP attributes (`toolname="send-brief"`, `tooldescription`, and `toolparamdescription` on each field), so browsers that support WebMCP can offer it to an agent as a tool. It deliberately has no `toolautosubmit`: the agent fills the form in and the visitor checks it and presses Send. If you add or rename a form field, give it a `toolparamdescription` too.
- Automated browsers (`navigator.webdriver`) skip the scroll-in animations, so every section is visible straight away; people still see them.
- Every page has structured data, including its questions and answers (`FAQPage`), so agents can read the facts without parsing the layout. If you change a question or answer on a page, change it in that page's structured data too.

## Editing the pages
- The header and footer are written out in every page. To change a link or a line in them, change it in each `.html` file (search the folder for the text).
- Each service page links to the contact form with `/?service=<option>#contact`, which opens the form with that service chosen. The value must match an option in the form's "What do you need?" list exactly.
- Structured data for Google is the `application/ld+json` block in the head of each page. The home page describes the studio; each service page describes its service and starting price. When you have them, add `email`, `telephone` and `sameAs` (your social profile links) to the home page block.

## Languages
English is written directly in the HTML. Albanian (`sq`), Italian (`it`), German (`de`), French (`fr`) and Spanish (`es`) each live in `i18n/<code>.js`, which a visitor only downloads when they pick that language. The menu remembers the choice, and a link such as `index.html?lang=de` opens straight in that language.

- In each language file, every key is the exact English text on the page and every value is its translation. If you change English copy in the HTML, update that key in every language file; until you do, that one sentence simply stays in English.
- To add a language, copy `sq.js` to `i18n/<code>.js`, translate the values, and add the language to `LANGS` at the top of `i18n/i18n.js`.
- The translations were written with AI assistance; have a native speaker review each language, and a lawyer review the privacy notice, before relying on them.

## Before going live
1. **Contact form** — briefs are sent in the background by [Web3Forms](https://web3forms.com). Each access key emails the one inbox it was created for and is public by design. The keys are `FORM_KEYS` in `index.html`, and the form sends a copy for each one; to add an inbox, create a key at web3forms.com with that address and add it to the list. Addresses are deliberately kept out of this repository and the page.
2. **Domain** — update `canonical`, `og:url` and `og:image` if the domain changes; the site is served from `https://scavelostudio.co.uk/`.
3. **Privacy notice** — complete the legal entity, address, contact email and processors.
4. **Prices** — every price appears in plain text; search the whole folder for `€` to adjust, including the service pages, the language files, `llms.txt` and the `minPrice` values in the structured data.
5. **Google** — add the site in Google Search Console (a *Domain* property for `scavelostudio.co.uk`, verified with the DNS record it gives you), submit `https://scavelostudio.co.uk/sitemap.xml`, and request indexing of the home page. The privacy notice is marked `noindex` until its placeholders are filled in.

## Deploy on GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → `main` / root. The custom domain is set by the `CNAME` file (`scavelostudio.co.uk`); keep it in the repository root, and tick **Enforce HTTPS** under Settings → Pages.
