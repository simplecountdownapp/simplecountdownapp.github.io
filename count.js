// Counts this visit: the page, where it came from and the country. No cookie, nothing stored on the device,
// no ID. What is counted: https://simplecountdownapp.github.io/privacy/#website
// Source: simple-count/tools/site-visits (edit it there; store_link.py copies it into the site).
(function () {
  var me = document.currentScript, page = me && me.getAttribute("data-page");
  if (!page || !navigator.sendBeacon || navigator.webdriver) return;
  if (location.hostname !== "simplecountdownapp.github.io") return;
  var utm = /[?&]utm_source=([A-Za-z0-9._-]{1,40})/.exec(location.search);
  var from = /^[a-z-]+:\/\/([^\/:?#]+)/i.exec(document.referrer);
  function send(kind) {
    navigator.sendBeacon("https://visits.simplecountapp.com/v",
      JSON.stringify({ p: page, k: kind, r: from ? from[1] : "", u: utm ? utm[1] : "" }));
  }
  // A reload or the back button is not a new visit; a page loaded in the background counts once it is seen.
  var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (!nav || nav.type === "navigate" || nav.type === "prerender") {
    if (document.visibilityState === "visible") send("view");
    else document.addEventListener("visibilitychange", function seen() {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", seen);
      send("view");
    });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://apps.apple.com/"]');
    if (a && a.href.indexOf("id6761277550") > 0) send("tap");
  }, true);
})();
