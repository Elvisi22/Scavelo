/* Scavelo: script shared by the service pages and the 404 page.
   The home page keeps its own inline script (it also runs the proposal tabs and the contact form).
   Load i18n/i18n.js before this file. */
(function () {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dict = null; // the chosen language's data; null means English
  const t = en => (dict && dict.strings[en]) || en;
  const I18N_SKIP = 'script,style,[data-f],#lang,[data-i18n-skip]';

  /* ---- Header: hairline once the page scrolls, dark glass over dark sections ---- */
  const nav = document.getElementById('nav'), menuBtn = document.getElementById('menu-btn'), links = document.getElementById('links');
  const darkZones = [...document.querySelectorAll('.dark, footer')];
  function markNav() {
    nav.classList.toggle('scrolled', scrollY > 4);
    const y = nav.offsetHeight / 2;
    const overDark = !links.classList.contains('open') && darkZones.some(z => { const r = z.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
    nav.classList.toggle('on-dark', overDark);
  }
  markNav(); addEventListener('scroll', markNav, { passive: true }); addEventListener('resize', markNav);

  /* ---- Mobile menu ---- */
  function setMenu(open) {
    links.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', t(open ? 'Close menu' : 'Open menu'));
    markNav();
  }
  menuBtn.addEventListener('click', () => {
    const open = !links.classList.contains('open'); setMenu(open);
    if (open) links.querySelector('a').focus({ preventScroll: true });
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---- Reveal on scroll ---- */
  const revealables = document.querySelectorAll('.reveal,.viz,.steps');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealables.forEach(el => io.observe(el));
  } else revealables.forEach(el => el.classList.add('in'));

  /* ---- Subtle parallax on the illustrations ---- */
  const floaters = [...document.querySelectorAll('[data-parallax]')];
  if (floaters.length && !reduceMotion) {
    const wide = matchMedia('(min-width: 735px)'); let ticking = false;
    const run = () => {
      ticking = false; const vh = innerHeight;
      floaters.forEach(el => {
        if (!wide.matches) { el.style.transform = ''; return; }
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const max = +(el.dataset.max || 26);
        const off = Math.max(-max, Math.min(max, ((r.top + r.height / 2) - vh / 2) * parseFloat(el.dataset.parallax)));
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue); run();
  }

  /* ---- Example proposal: its text comes from the language file's "proposals" list (same order as the home page) ---- */
  const doc = document.querySelector('[data-proposal]');
  const field = f => doc.querySelector('[data-f=' + f + ']');
  const enProposal = doc && {
    project: field('project').textContent, problem: field('problem').textContent,
    time: field('time').textContent, price: field('price').textContent,
    items: [...field('items').children].map(li => li.textContent)
  };
  function fillProposal() {
    if (!doc) return;
    const tr = dict && dict.proposals && dict.proposals[+doc.dataset.proposal];
    const p = tr ? { ...enProposal, ...tr } : enProposal;
    ['project', 'problem', 'time', 'price'].forEach(f => { field(f).textContent = p[f]; });
    const ul = field('items'); ul.innerHTML = '';
    p.items.forEach(text => { const li = document.createElement('li'); li.textContent = text; ul.appendChild(li); });
  }

  /* ---- Language menu: ?lang= in the URL, then the saved choice, then the browser language ---- */
  const descTag = document.querySelector('meta[name="description"]');
  const EN_META = { title: document.title, description: descTag ? descTag.content : '' };
  let langRequest = 0;
  async function setLang(next, persist) {
    const ticket = ++langRequest; let data = null;
    if (next !== 'en') {
      ScaveloI18n.setLoading(true);
      try { data = await ScaveloI18n.load(next); } catch (e) { console.warn('Scavelo:', e.message); ScaveloI18n.setLoading(false); return; }
      ScaveloI18n.setLoading(false);
      if (ticket !== langRequest) return; // a newer choice arrived while this one was loading
    }
    dict = data;
    document.documentElement.lang = next;
    ScaveloI18n.translate(dict && dict.strings, I18N_SKIP);
    document.title = t(EN_META.title);
    if (descTag) descTag.content = t(EN_META.description);
    ScaveloI18n.setCurrent(next);
    menuBtn.setAttribute('aria-label', t(links.classList.contains('open') ? 'Close menu' : 'Open menu'));
    fillProposal();
    if (persist) ScaveloI18n.remember(next);
  }
  ScaveloI18n.mountMenu(document.getElementById('lang'), code => setLang(code, true));
  ScaveloI18n.setCurrent('en');
  const startLang = ScaveloI18n.detect();
  if (startLang !== 'en') setLang(startLang, false);
})();
