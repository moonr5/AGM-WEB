(function () {
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
