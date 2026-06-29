/**
 * AGM hero — mobile enhancements (max-width: 768px only).
 * Sets --agm-hero-h for true fullscreen below fixed appbar on all phone sizes.
 */
(function () {
  var MQ = "(max-width: 768px)";
  var APPBAR_H = 60;

  function isMobile() {
    return window.matchMedia(MQ).matches;
  }

  function readSafeTop() {
    var probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top);visibility:hidden;pointer-events:none";
    document.documentElement.appendChild(probe);
    var top = parseFloat(getComputedStyle(probe).paddingTop) || 0;
    probe.remove();
    return top;
  }

  function setHeroHeight() {
    var root = document.documentElement;
    if (!isMobile()) {
      root.style.removeProperty("--agm-hero-h");
      return;
    }

    var vv = window.visualViewport;
    var viewportH = vv && vv.height ? vv.height : window.innerHeight;
    var heroH = Math.max(280, Math.round(viewportH - APPBAR_H - readSafeTop()));
    root.style.setProperty("--agm-hero-h", heroH + "px");
  }

  function syncHeroMode() {
    var root = document.documentElement;
    if (isMobile()) {
      root.classList.add("agm-hero-is-mobile");
      setHeroHeight();
    } else {
      root.classList.remove("agm-hero-is-mobile");
      root.style.removeProperty("--agm-hero-h");
    }
  }

  function init() {
    syncHeroMode();
    var mq = window.matchMedia(MQ);
    if (mq.addEventListener) {
      mq.addEventListener("change", syncHeroMode);
    } else if (mq.addListener) {
      mq.addListener(syncHeroMode);
    }

    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setHeroHeight, 80);
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", setHeroHeight, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
