(function () {
  "use strict";

  function setViewportHeight() {
    var h = window.innerHeight;
    document.documentElement.style.setProperty("--agm-vh", h + "px");
    document.documentElement.style.setProperty("--agm-vw", window.innerWidth + "px");
  }

  function ensureViewportMeta() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;

    var content = meta.getAttribute("content") || "";
    var next = content;

    if (!/width=device-width/.test(next)) {
      next = "width=device-width, initial-scale=1" + (next ? ", " + next : "");
    }
    if (!/viewport-fit=cover/.test(next)) {
      next += ", viewport-fit=cover";
    }

    meta.setAttribute("content", next);
  }

  /** Replace inline 100vw widths that cause horizontal scroll on mobile */
  function fixInlineViewportWidths() {
    var nodes = document.querySelectorAll("[style]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var style = el.getAttribute("style") || "";
      if (!/100vw/i.test(style)) continue;
      el.style.width = "100%";
      el.style.maxWidth = "100%";
    }
  }

  /** Prevent body scroll when HubSpot mobile drawer is open */
  function bindMenuScrollLock() {
    var overlay = document.getElementById("overlay");
    var mobileMenu = document.querySelector(".mobile-menu");

    function syncLock() {
      var open =
        (overlay && overlay.classList.contains("open")) ||
        (mobileMenu && mobileMenu.classList.contains("open"));
      document.documentElement.classList.toggle("agm-menu-open", !!open);
    }

    if (overlay) {
      new MutationObserver(syncLock).observe(overlay, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    if (mobileMenu) {
      new MutationObserver(syncLock).observe(mobileMenu, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    document.addEventListener("click", function (e) {
      if (e.target.closest("#burger")) {
        setTimeout(syncLock, 50);
      }
    });
  }

  function init() {
    ensureViewportMeta();
    setViewportHeight();
    fixInlineViewportWidths();
    bindMenuScrollLock();

    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setViewportHeight();
        fixInlineViewportWidths();
      }, 100);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", setViewportHeight, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize, { passive: true });
    }

    /* Re-run after React island hydration */
    setTimeout(fixInlineViewportWidths, 500);
    setTimeout(fixInlineViewportWidths, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
