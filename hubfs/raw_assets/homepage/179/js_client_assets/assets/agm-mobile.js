(function () {
  function setViewportHeight() {
    document.documentElement.style.setProperty("--agm-vh", window.innerHeight + "px");
  }

  function ensureViewportMeta() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;

    const content = meta.getAttribute("content") || "";
    let next = content;

    if (!/width=device-width/.test(next)) {
      next = "width=device-width, initial-scale=1" + (next ? ", " + next : "");
    }
    if (!/viewport-fit=cover/.test(next)) {
      next += ", viewport-fit=cover";
    }

    meta.setAttribute("content", next);
  }

  function init() {
    ensureViewportMeta();
    setViewportHeight();
    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setViewportHeight, 100);
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", setViewportHeight, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize, { passive: true });
    }

    function playHeroVideos() {
      document.querySelectorAll("#hero video").forEach(function (video) {
        video.muted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        if (!video.getAttribute("preload")) {
          video.preload = "auto";
        }
        video.load();
        video.play().catch(function () {});
      });
    }

    playHeroVideos();
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) playHeroVideos();
    });
    new MutationObserver(playHeroVideos).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
