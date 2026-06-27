(function () {
  "use strict";

  /** Desktop layout width — page renders at this width and scales down on phones. */
  var DESKTOP_WIDTH = 1280;
  /** Viewports at or above this width use normal responsive meta. */
  var DESKTOP_BREAKPOINT = 1280;

  function applyDesktopViewport() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }

    var screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      screen.width;

    if (screenWidth >= DESKTOP_BREAKPOINT) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover"
      );
      document.documentElement.classList.remove("agm-desktop-scaled");
      return;
    }

    var scale = Math.max(0.1, screenWidth / DESKTOP_WIDTH);
    meta.setAttribute(
      "content",
      "width=" +
        DESKTOP_WIDTH +
        ", initial-scale=" +
        scale +
        ", viewport-fit=cover"
    );
    document.documentElement.classList.add("agm-desktop-scaled");
    document.documentElement.style.setProperty("--agm-desktop-width", DESKTOP_WIDTH + "px");
  }

  function setViewportHeight() {
    document.documentElement.style.setProperty("--agm-vh", window.innerHeight + "px");
    document.documentElement.style.setProperty("--agm-vw", window.innerWidth + "px");
  }

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
    applyDesktopViewport();
    setViewportHeight();
    bindMenuScrollLock();

    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        applyDesktopViewport();
        setViewportHeight();
      }, 100);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        applyDesktopViewport();
        setViewportHeight();
      }, 150);
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
