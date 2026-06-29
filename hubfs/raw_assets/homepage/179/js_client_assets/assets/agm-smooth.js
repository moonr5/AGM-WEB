(function () {
  const WARM_SOURCES = [
    "/en/p8.mp4",
    "/en/videos/services/charter-blue.mp4",
    "/en/videos/services/shipbuilding-blue.mp4",
    "/en/videos/services/marine-support-blue.mp4",
  ];

  function normalizeVideoSrc(src) {
    if (!src) return src;
    try {
      const url = new URL(src, window.location.origin);
      if (url.pathname.startsWith("/videos/services/")) {
        url.pathname = `/en${url.pathname}`;
        return url.pathname;
      }
      if (/^\/p[789]\.mp4$/.test(url.pathname)) {
        url.pathname = `/en${url.pathname}`;
        return url.pathname;
      }
      return url.pathname + url.search;
    } catch {
      if (src.startsWith("/videos/services/")) return `/en${src}`;
      if (/^\/p[789]\.mp4$/.test(src)) return `/en${src}`;
      return src;
    }
  }

  function fixVideoSources(root) {
    root.querySelectorAll("video source[src], video[src]").forEach((node) => {
      const attr = node.tagName === "SOURCE" ? "src" : "src";
      const current = node.getAttribute(attr);
      const fixed = normalizeVideoSrc(current);
      if (fixed && fixed !== current) {
        node.setAttribute(attr, fixed);
      }
    });
  }

  function warmVideo(src) {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = normalizeVideoSrc(src);
    video.load();
  }

  function scheduleHeroWarm() {
    const run = () => {
      WARM_SOURCES.forEach((src, index) => {
        setTimeout(() => warmVideo(src), index * 200);
      });
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 2000);
    }
  }

  function prepareLoaderImages() {
    document.querySelectorAll("._heroImages_biyw3_32 img").forEach((img, index) => {
      img.decoding = "async";
      if (index >= 3) img.loading = "lazy";
    });

    document.querySelectorAll('img[src*="p61.svg"]').forEach((img, index) => {
      img.decoding = "async";
      if (index > 0) img.loading = "lazy";
    });
  }

  function enhance(node) {
    if (!(node instanceof HTMLVideoElement) || node.dataset.agmSmooth) return;
    node.dataset.agmSmooth = "1";
    node.muted = true;
    node.playsInline = true;
    node.setAttribute("playsinline", "");
    fixVideoSources(node);

    const preload = node.getAttribute("preload");
    if (!preload || preload === "auto") {
      node.preload = "metadata";
    }

    let primed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!primed) {
            primed = true;
            node.preload = "auto";
            node.load();
          }
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.12, rootMargin: "120px 0px" },
    );

    observer.observe(node);
  }

  function scan(root) {
    fixVideoSources(root);
    root.querySelectorAll("video").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        prepareLoaderImages();
        scheduleHeroWarm();
        scan(document);
      },
      { once: true },
    );
  } else {
    prepareLoaderImages();
    scheduleHeroWarm();
    scan(document);
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) enhance(node);
        else if (node instanceof Element) scan(node);
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
