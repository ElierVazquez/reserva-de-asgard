// Preloader: show pulsing logo until all resources are loaded, then fade out
(function () {
  var HIDE_DELAY_MS = 1000; // after adding hide class, wait before removing from DOM
  var KILL_TIMEOUT_MS = 10000; // safety: hide even if 'load' never fires

  function hidePreloader() {
    var el = document.getElementById('preloader');
    if (!el) return;
    if (el.classList.contains('preloader--hide')) return;
    el.classList.add('preloader--hide');
    // Remove from DOM after transition
    setTimeout(function () {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, HIDE_DELAY_MS + 100);
  }

  // Hide on full load
  window.addEventListener('load', setTimeout(hidePreloader, 2000));
  // Safety: ensure it goes away after a while even if some resource blocks
  setTimeout(hidePreloader, KILL_TIMEOUT_MS);
})();
