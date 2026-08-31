/* ==========================================================================
   Almyro Glyko — site behaviour
   No dependencies. Every feature degrades gracefully without JS.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var store = {
    get: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    }
  };

  /* ------------------------------------------------------------------
     1. Language toggle (EN / EL)
        Any element with data-en + data-el swaps its text content.
        Elements with data-en-attr-<attr> swap an attribute instead.
     ------------------------------------------------------------------ */

  var LANG_LABEL = {
    en: { aria: "Switch language to Greek", htmlLang: "en" },
    el: { aria: "Αλλαγή γλώσσας στα Αγγλικά", htmlLang: "el" }
  };

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-en][data-el]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = el.getAttribute("data-" + lang);
      if (value !== null) el.textContent = value;
    }

    var attrNodes = document.querySelectorAll("[data-en-title][data-el-title]");
    for (var j = 0; j < attrNodes.length; j++) {
      attrNodes[j].setAttribute(
        "title",
        attrNodes[j].getAttribute("data-" + lang + "-title")
      );
    }

    root.dataset.lang = lang;
    root.lang = LANG_LABEL[lang].htmlLang;

    var toggle = document.getElementById("lang-toggle");
    if (toggle) {
      toggle.setAttribute("aria-label", LANG_LABEL[lang].aria);
      var en = toggle.querySelector("[data-lang-en]");
      var el2 = toggle.querySelector("[data-lang-el]");
      if (en) en.classList.toggle("lang-toggle__on", lang === "en");
      if (el2) el2.classList.toggle("lang-toggle__on", lang === "el");
    }

    store.set("ag-lang", lang);
  }

  var langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      applyLang(root.dataset.lang === "el" ? "en" : "el");
    });
  }

  // Honour a stored preference (the inline head script set the attribute early).
  applyLang(root.dataset.lang === "el" ? "el" : "en");

  /* ------------------------------------------------------------------
     2. Theme toggle (light / dark, defaults to system)
     ------------------------------------------------------------------ */

  var themeBtn = document.getElementById("theme-toggle");

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function syncThemeLabel() {
    if (!themeBtn) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      store.set("ag-theme", next);
      syncThemeLabel();
    });
    syncThemeLabel();
  }

  /* ------------------------------------------------------------------
     3. Mobile drawer — focus trap, Escape, scroll lock
     ------------------------------------------------------------------ */

  var drawer = document.getElementById("drawer");
  var openBtn = document.getElementById("menu-btn");
  var closeBtn = document.getElementById("drawer-close");
  var lastFocused = null;

  function focusables() {
    return drawer
      ? drawer.querySelectorAll('a[href], button:not([disabled])')
      : [];
  }

  function setDrawer(open) {
    if (!drawer || !openBtn) return;
    drawer.dataset.open = String(open);
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);

    if (open) {
      lastFocused = document.activeElement;
      var items = focusables();
      if (items.length) items[0].focus();
    } else if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  if (openBtn) openBtn.addEventListener("click", function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setDrawer(false); });

  if (drawer) {
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });

    document.addEventListener("keydown", function (e) {
      if (drawer.dataset.open !== "true") return;

      if (e.key === "Escape") {
        setDrawer(false);
        return;
      }

      if (e.key !== "Tab") return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Close the drawer if the viewport grows past the desktop breakpoint.
  var wide = window.matchMedia("(min-width: 62em)");
  var onWide = function (e) {
    if (e.matches && drawer && drawer.dataset.open === "true") setDrawer(false);
  };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else if (wide.addListener) wide.addListener(onWide);

  /* ------------------------------------------------------------------
     4. Sticky header shadow
     ------------------------------------------------------------------ */

  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     5. Reveal on scroll
     ------------------------------------------------------------------ */

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var r = 0; r < reveals.length; r++) reveals[r].classList.add("is-in");
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    for (var k = 0; k < reveals.length; k++) io.observe(reveals[k]);
  }

  /* ------------------------------------------------------------------
     6. Live "Open now / Closed" badge per shop
        Times are Cyprus local (EET/EEST). We read the visitor's clock in
        the Asia/Nicosia zone so the badge is correct from anywhere.
     ------------------------------------------------------------------ */

  var DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  function nicosiaNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Nicosia",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(new Date());

      var out = {};
      parts.forEach(function (p) { out[p.type] = p.value; });
      return {
        day: out.weekday.toLowerCase().slice(0, 3),
        minutes: parseInt(out.hour, 10) * 60 + parseInt(out.minute, 10)
      };
    } catch (e) {
      var d = new Date();
      return { day: DAYS[d.getDay()], minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function toMinutes(hhmm) {
    var bits = hhmm.split(":");
    return parseInt(bits[0], 10) * 60 + parseInt(bits[1], 10);
  }

  function parseHours(spec) {
    var table = {};
    spec.split(";").forEach(function (chunk) {
      var pair = chunk.split("=");
      if (pair.length !== 2) return;
      table[pair[0].trim()] = pair[1].trim();
    });
    return table;
  }

  var COPY = {
    en: { open: "Open now", closed: "Closed" },
    el: { open: "Ανοιχτά τώρα", closed: "Κλειστά" }
  };

  function refreshBadges() {
    var now = nicosiaNow();
    var lang = root.dataset.lang === "el" ? "el" : "en";

    document.querySelectorAll("[data-hours]").forEach(function (shop) {
      var badge = shop.querySelector("[data-open-badge]");
      if (!badge) return;

      var table = parseHours(shop.getAttribute("data-hours"));
      var today = table[now.day];
      var isOpen = false;

      if (today && today !== "x") {
        var range = today.split("-");
        if (range.length === 2) {
          var start = toMinutes(range[0]);
          var end = toMinutes(range[1]);
          // A closing time past midnight (e.g. 11:00-01:00) wraps around.
          isOpen = end > start
            ? now.minutes >= start && now.minutes < end
            : now.minutes >= start || now.minutes < end;
        }
      }

      badge.hidden = false;
      badge.dataset.state = isOpen ? "open" : "closed";
      badge.textContent = isOpen ? COPY[lang].open : COPY[lang].closed;
    });
  }

  refreshBadges();
  setInterval(refreshBadges, 60000);
  if (langBtn) langBtn.addEventListener("click", refreshBadges);

  /* ------------------------------------------------------------------
     7. Menu page — highlight the section currently in view
     ------------------------------------------------------------------ */

  var menuLinks = document.querySelectorAll(".menu-nav__link");
  if (menuLinks.length && "IntersectionObserver" in window) {
    var groups = [];
    menuLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) groups.push({ link: link, target: target });
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          groups.forEach(function (g) {
            var active = g.target === entry.target;
            g.link.classList.toggle("is-active", active);
            if (active) g.link.setAttribute("aria-current", "true");
            else g.link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-140px 0px -62% 0px", threshold: 0 }
    );

    groups.forEach(function (g) { spy.observe(g.target); });
  }

  /* ------------------------------------------------------------------
     8. Footer year
     ------------------------------------------------------------------ */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
