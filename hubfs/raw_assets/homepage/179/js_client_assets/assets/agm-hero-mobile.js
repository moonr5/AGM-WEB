/**
 * AGM hero — mobile enhancements (max-width: 768px only).
 * Adds body class for optional hooks; does not touch desktop.
 */
(function () {
  var MQ = "(max-width: 768px)";

  function isMobile() {
    return window.matchMedia(MQ).matches;
  }

  function syncHeroMode() {
    var root = document.documentElement;
    if (isMobile()) {
      root.classList.add("agm-hero-is-mobile");
    } else {
      root.classList.remove("agm-hero-is-mobile");
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
