(function () {
  const HERO_POSTER =
    "/hubfs/raw_assets/homepage/179/js_client_assets/assets/9_Loader_Manifesto-D7fJBKYS.jpg";
  const HERO_FALLBACK = "/en/v1.mp4";
  const HERO_SELECTOR = "._main_ty1x2_1 video, ._pinnedSection_biyw3_1 video, ._container_1im41_1 video";

  function isHeroVideo(node) {
    return node instanceof HTMLVideoElement && node.matches(HERO_SELECTOR);
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

    if (!node.poster) node.poster = HERO_POSTER;

    if (/p8\.mp4/i.test(node.currentSrc || node.src || "")) {
      node.addEventListener(
        "error",
        () => {
          if (!/v1\.mp4/i.test(node.currentSrc || node.src || "")) {
            node.src = HERO_FALLBACK;
            node.load();
            node.play().catch(() => {});
          }
        },
        { once: true },
      );
    }

    if (isHeroVideo(node)) {
      node.preload = "auto";
      node.play().catch(() => {});
      return;
    }

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
    root.querySelectorAll("video").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        prepareLoaderImages();
      },
      { once: true },
    );
  } else {
    prepareLoaderImages();
  }

  scan(document);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) enhance(node);
        else if (node instanceof Element) scan(node);
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
