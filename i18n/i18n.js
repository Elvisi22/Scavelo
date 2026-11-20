/* Scavelo language support, shared by index.html and privacy.html.
   English lives in the HTML itself. Every other language is a file next to this one
   (i18n/<code>.js) that is only downloaded when a visitor picks it.
   To add a language: create i18n/<code>.js with the same shape as sq.js and add it to LANGS. */
(function () {
  var LANGS = [
    { code: 'en', name: 'English' },
    { code: 'sq', name: 'Shqip' },
    { code: 'it', name: 'Italiano' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];
  var STORAGE_KEY = 'scavelo-lang';
  var codes = LANGS.map(function (l) { return l.code; });
  var base = document.currentScript ? new URL('.', document.currentScript.src).href : 'i18n/';
  var store = window.SCAVELO_I18N = window.SCAVELO_I18N || {};
  var pending = {};

  /* Download a language file once; resolves with its data (null for English). */
  function load(code) {
    if (code === 'en') return Promise.resolve(null);
    if (store[code]) return Promise.resolve(store[code]);
    if (!pending[code]) {
      pending[code] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = base + code + '.js';
        s.onload = function () { store[code] ? resolve(store[code]) : reject(new Error('i18n/' + code + '.js has no data')); };
        s.onerror = function () { delete pending[code]; reject(new Error('could not load i18n/' + code + '.js')); };
        document.head.appendChild(s);
      });
    }
    return pending[code];
  }

  /* Swap every text node and label whose English text has a translation; null restores English. */
  var enText = new WeakMap(), enAttr = new WeakMap();
  function translate(strings, skip) {
    var lookup = function (en) { return (strings && strings[en]) || en; };
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!enText.has(n)) enText.set(n, n.nodeValue);
      var en = enText.get(n), key = en.replace(/\s+/g, ' ').trim();
      var tr = key && strings && strings[key];
      n.nodeValue = tr ? en.match(/^\s*/)[0] + tr + en.match(/\s*$/)[0] : en;
    }
    document.querySelectorAll('[placeholder],[aria-label]').forEach(function (el) {
      if (el.closest('[data-i18n-skip]')) return;
      if (!enAttr.has(el)) enAttr.set(el, { placeholder: el.getAttribute('placeholder'), label: el.getAttribute('aria-label') });
      var o = enAttr.get(el);
      if (o.placeholder !== null) el.setAttribute('placeholder', lookup(o.placeholder));
      if (o.label !== null) el.setAttribute('aria-label', lookup(o.label));
    });
  }

  /* Starting language: ?lang= in the URL, then the visitor's saved choice, then their browser language. */
  function detect() {
    var pick = null;
    try { pick = new URLSearchParams(location.search).get('lang') || localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (pick && codes.indexOf(pick) >= 0) return pick;
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var primary = String(prefs[i]).toLowerCase().split('-')[0];
      if (codes.indexOf(primary) >= 0) return primary;
    }
    return 'en';
  }

  function remember(code) {
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (code === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', code);
      history.replaceState(null, '', u);
    } catch (e) {}
  }

  /* The menu: a compact button (globe + code) that opens a list of languages in their own names. */
  var CSS =
    '.lang{position:relative;flex:none}' +
    '.lang-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px 0 9px;border:0;border-radius:9px;background:rgba(0,0,0,.05);color:var(--ink-2,#424245);font:600 12px/1 var(--sans,system-ui);letter-spacing:.04em;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background-color .25s,color .25s}' +
    '.lang-btn:hover{background:rgba(0,0,0,.08);color:var(--ink,#1D1D1F)}' +
    '.lang-btn svg{flex:none;width:15px;height:15px}' +
    '.lang-btn .lang-caret{width:9px;height:9px;opacity:.7;transition:transform .3s cubic-bezier(.16,1,.3,1)}' +
    '.lang-btn[aria-expanded="true"] .lang-caret{transform:rotate(180deg)}' +
    '.lang-btn.loading{opacity:.6;cursor:progress}' +
    '.lang-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:200;min-width:208px;padding:6px;border-radius:14px;background:rgba(255,255,255,.94);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);box-shadow:0 0 0 1px rgba(0,0,0,.06),0 12px 30px -8px rgba(0,0,0,.18),0 30px 60px -30px rgba(0,0,0,.25);transform-origin:top right;animation:langMenuIn .22s cubic-bezier(.16,1,.3,1)}' +
    '.lang-menu[hidden]{display:none}' +
    '@keyframes langMenuIn{from{opacity:0;transform:translateY(-4px) scale(.97)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){.lang-menu{animation:none}}' +
    '.lang-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:0;border-radius:9px;background:none;font:500 14px/1.2 var(--sans,system-ui);letter-spacing:-.01em;color:var(--ink,#1D1D1F);text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.lang-menu button:hover,.lang-menu button:focus-visible{background:rgba(0,0,0,.05);outline:none}' +
    '.lang-menu .lang-name{flex:1}' +
    '.lang-menu .lang-code{font-size:11px;font-weight:600;letter-spacing:.06em;color:var(--ink-3,#6E6E73)}' +
    '.lang-menu .lang-tick{width:14px;height:14px;color:var(--accent,#0B7A68);visibility:hidden}' +
    '.lang-menu button[aria-checked="true"] .lang-tick{visibility:visible}' +
    '.lang-menu button[aria-checked="true"] .lang-name{font-weight:600}' +
    '.nav-bar.on-dark .lang-btn{background:rgba(255,255,255,.12);color:#F5F5F7}' +
    '.nav-bar.on-dark .lang-btn:hover{background:rgba(255,255,255,.2);color:#fff}' +
    '@media(max-width:900px){.lang-btn{height:36px}}';
  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z"/></svg>';
  var CARET = '<svg class="lang-caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>';
  var TICK = '<svg class="lang-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';

  var ui = null;
  function mountMenu(root, onPick) {
    if (!document.getElementById('scavelo-lang-css')) {
      var st = document.createElement('style'); st.id = 'scavelo-lang-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    root.innerHTML =
      '<button type="button" class="lang-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="lang-menu" aria-label="Choose language">' +
      GLOBE + '<span class="lang-current">EN</span>' + CARET + '</button>' +
      '<div class="lang-menu" id="lang-menu" role="menu" aria-label="Language" hidden>' +
      LANGS.map(function (l) {
        return '<button type="button" role="menuitemradio" aria-checked="false" data-lang="' + l.code + '" lang="' + l.code + '">' +
          TICK + '<span class="lang-name">' + l.name + '</span><span class="lang-code">' + l.code.toUpperCase() + '</span></button>';
      }).join('') + '</div>';
    var btn = root.querySelector('.lang-btn'), menu = root.querySelector('.lang-menu');
    var items = Array.prototype.slice.call(menu.querySelectorAll('[data-lang]'));
    function open(focusItem) {
      menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
      if (focusItem) (menu.querySelector('[aria-checked="true"]') || items[0]).focus();
    }
    function close(refocus) {
      if (menu.hidden) return;
      menu.hidden = true; btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus();
    }
    btn.addEventListener('click', function () { menu.hidden ? open(true) : close(false); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(true); } });
    menu.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close(false);
    });
    items.forEach(function (it) { it.addEventListener('click', function () { close(true); onPick(it.dataset.lang); }); });
    document.addEventListener('click', function (e) { if (!root.contains(e.target)) close(false); });
    ui = { btn: btn, items: items, label: root.querySelector('.lang-current') };
  }

  function setCurrent(code) {
    if (!ui) return;
    ui.label.textContent = code.toUpperCase();
    ui.items.forEach(function (it) { it.setAttribute('aria-checked', String(it.dataset.lang === code)); });
  }
  function setLoading(on) { if (ui) ui.btn.classList.toggle('loading', !!on); }

  window.ScaveloI18n = { LANGS: LANGS, load: load, translate: translate, detect: detect, remember: remember, mountMenu: mountMenu, setCurrent: setCurrent, setLoading: setLoading };
})();
