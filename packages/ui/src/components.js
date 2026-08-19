/* ==========================================================================
   3DS HOME PLATFORM — INTERAKTIV KOMPONENTLAR
   --------------------------------------------------------------------------
   Vanilla ES modul. React ga ko'chirish ahamiyatsiz — mantiq shu yerda,
   React qatlami faqat o'rash bo'ladi.

   Prototipda tuzatilgan xatolar:
     BUG-B13  toast'lar bir-birini o'chirardi (bitta element, tozalanmagan taymer)
     BUG-31   modal Esc bilan yopilmasdi, fokus qamalmasdi
     BUG-C19  listener'lar tozalanmasdi
   ========================================================================== */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   TOAST — navbat bilan. TZ NFR-UX-12
   Har bir toast MUSTAQIL element va MUSTAQIL taymer.
   ========================================================================== */

export const Toast = {
  _region: null,
  _items: new Map(),   // id -> { el, timer }
  _seq: 0,
  max: 3,              // ekranni bosib ketmasin
  duration: 4000,

  _ensureRegion() {
    if (this._region?.isConnected) return this._region;
    const el = document.createElement('div');
    el.className = 'toast-region';
    // Skrinrider uchun: xabarlar e'lon qilinadi, lekin fokusni o'g'irlamaydi
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'false');
    document.body.appendChild(el);
    this._region = el;
    return el;
  },

  /**
   * @param {string} text
   * @param {{type?: 'info'|'success'|'error'|'warning', title?: string, duration?: number}} opts
   * @returns {number} toast id — dismiss() uchun
   */
  show(text, opts = {}) {
    const { type = 'info', title, duration = this.duration } = opts;
    const region = this._ensureRegion();

    // Limitdan oshsa — eng eskisini chiqarish
    while (this._items.size >= this.max) {
      const oldest = this._items.keys().next().value;
      this.dismiss(oldest);
    }

    const id = ++this._seq;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    // Xato — darhol e'lon qilinadi (TZ NFR-A11Y-05)
    if (type === 'error') el.setAttribute('role', 'alert');

    const icon = { info: 'ℹ', success: '✓', error: '⚠', warning: '⚠' }[type] ?? 'ℹ';
    el.innerHTML =
      `<span class="toast-icon" aria-hidden="true"></span>` +
      `<div class="toast-body">` +
        (title ? `<div class="toast-title"></div>` : '') +
        `<div class="toast-text"></div>` +
      `</div>` +
      `<button class="btn btn-ghost btn-icon btn-sm" aria-label="Yopish">✕</button>`;

    // Matn HAR DOIM textContent orqali — XSS yo'q (TZ SEC-04)
    el.querySelector('.toast-icon').textContent = icon;
    if (title) el.querySelector('.toast-title').textContent = title;
    el.querySelector('.toast-text').textContent = text;
    el.querySelector('button').addEventListener('click', () => this.dismiss(id));

    region.appendChild(el);

    // HAR BIR toast o'z taymeriga ega — prototipdagi asosiy xato shu edi
    const timer = duration > 0 ? window.setTimeout(() => this.dismiss(id), duration) : null;
    this._items.set(id, { el, timer });
    return id;
  },

  dismiss(id) {
    const item = this._items.get(id);
    if (!item) return;
    this._items.delete(id);
    if (item.timer) clearTimeout(item.timer);

    if (prefersReducedMotion()) { item.el.remove(); return; }
    item.el.dataset.leaving = '';
    item.el.addEventListener('animationend', () => item.el.remove(), { once: true });
    // Animatsiya o'tmasa ham element qolib ketmasin
    setTimeout(() => item.el.remove(), 400);
  },

  clear() { [...this._items.keys()].forEach(id => this.dismiss(id)); },

  success(t, o) { return this.show(t, { ...o, type: 'success' }); },
  error(t, o)   { return this.show(t, { ...o, type: 'error' }); },
  warning(t, o) { return this.show(t, { ...o, type: 'warning' }); },
  info(t, o)    { return this.show(t, { ...o, type: 'info' }); },
};

/* ==========================================================================
   FOCUS TRAP — TZ NFR-A11Y-03
   ========================================================================== */

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

const focusableIn = root =>
  [...root.querySelectorAll(FOCUSABLE)].filter(el =>
    el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

/* ==========================================================================
   MODAL — Esc, focus trap, fokus qaytishi, scroll lock
   ========================================================================== */

export class Modal {
  /**
   * @param {HTMLElement} el  .modal-backdrop elementi
   * @param {{onClose?: Function, closeOnBackdrop?: boolean}} opts
   */
  constructor(el, opts = {}) {
    this.el = el;
    this.dialog = el.querySelector('.modal') ?? el;
    this.onClose = opts.onClose;
    this.closeOnBackdrop = opts.closeOnBackdrop !== false;
    this._prevFocus = null;
    this._listeners = [];
    this.isOpen = false;
  }

  _on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this._listeners.push(() => target.removeEventListener(type, fn, opts));
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    // Fokus qayerdan kelganini eslab qolish — yopilganda qaytariladi
    this._prevFocus = document.activeElement;

    this.el.hidden = false;
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    document.body.dataset.scrollLocked = '';

    // Fokusni ichkariga o'tkazish
    const first = this.dialog.querySelector('[data-autofocus]') ?? focusableIn(this.dialog)[0];
    (first ?? this.dialog).focus({ preventScroll: true });
    if (!first) this.dialog.tabIndex = -1;

    // Esc — TZ NFR-A11Y-03
    this._on(document, 'keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
      if (e.key === 'Tab') this._trap(e);
    });

    if (this.closeOnBackdrop) {
      this._on(this.el, 'mousedown', e => { if (e.target === this.el) this.close(); });
    }
    this.el.querySelectorAll('[data-modal-close]').forEach(btn =>
      this._on(btn, 'click', () => this.close()));
  }

  _trap(e) {
    const items = focusableIn(this.dialog);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    // BARCHA listener tozalanadi — prototipdagi oqish takrorlanmaydi
    this._listeners.forEach(off => off());
    this._listeners = [];

    this.el.hidden = true;
    delete document.body.dataset.scrollLocked;

    // Fokus kelgan joyiga qaytadi
    if (this._prevFocus?.isConnected) this._prevFocus.focus({ preventScroll: true });
    this._prevFocus = null;

    this.onClose?.();
  }

  destroy() { this.close(); }
}

/* ==========================================================================
   BIR MARTALIK YUBORISH — TZ FR-PAY-04 (ikki marta bosish himoyasi)
   ========================================================================== */

export function guardSubmit(button, handler) {
  let busy = false;
  return async (...args) => {
    if (busy) return;
    busy = true;
    button.dataset.loading = 'true';
    button.disabled = true;
    try { return await handler(...args); }
    finally {
      busy = false;
      delete button.dataset.loading;
      button.disabled = false;
    }
  };
}

/* ==========================================================================
   DEBOUNCE — TZ FR-CAT-06 (qidiruv 400ms)
   ========================================================================== */

export function debounce(fn, wait = 400) {
  let t;
  const wrapped = (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
}

/* ==========================================================================
   MAVZU — tanlov saqlanadi, tizim sozlamasiga ergashadi
   ========================================================================== */

export const Theme = {
  KEY: '3ds-theme',

  get() {
    return document.documentElement.getAttribute('data-theme')
      ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  },

  set(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem(this.KEY);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.KEY, theme);
    }
  },

  toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); return this.get(); },

  /** FOUC oldini olish uchun <head> da, render'dan OLDIN chaqiriladi */
  init() {
    const saved = localStorage.getItem(this.KEY);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  },
};
