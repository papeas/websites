/* Anafi Bags — interactions
   Mobile nav · sticky header · category filter · quick-look modal · scroll reveal */
(function () {
  'use strict';

  var IG_URL = 'https://www.instagram.com/anafi.bags_/';

  /* ── Mobile nav ───────────────────────────────────────────────────────── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  /* ── Sticky header shadow ─────────────────────────────────────────────── */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  if (header) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Category filter ──────────────────────────────────────────────────── */
  var filters = document.querySelectorAll('.filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#productGrid .card'));
  var emptyMsg = document.getElementById('gridEmpty');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.filter;

      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      var shown = 0;
      cards.forEach(function (card) {
        var match = value === 'all' || card.dataset.category === value;
        card.hidden = !match;
        if (match) shown++;
      });

      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    });
  });

  /* ── Quick-look modal ─────────────────────────────────────────────────── */
  var modal = document.getElementById('modal');
  var lastFocused = null;

  var fields = {
    img: document.getElementById('modalImg'),
    title: document.getElementById('modalTitle'),
    desc: document.getElementById('modalDesc'),
    meta: document.getElementById('modalMeta'),
    cta: document.getElementById('modalCta')
  };

  function openModal(card) {
    var d = card.dataset;

    fields.img.src = d.img;
    fields.img.alt = d.name;
    fields.title.textContent = d.name;
    fields.desc.textContent = d.desc;
    fields.meta.textContent = d.meta;
    fields.cta.textContent = 'Ask about the ' + d.name;
    fields.cta.href = IG_URL;

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    document.getElementById('modalClose').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.card-quick').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.closest('.card'));
    });
  });

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close') || e.target.closest('.modal-close')) closeModal();
    });

    // Keep tabbing inside the dialog while it's open.
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = modal.querySelectorAll('button, [href]');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal && !modal.hidden) closeModal();
    if (nav && nav.classList.contains('is-open')) closeNav();
  });

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Footer year ──────────────────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
