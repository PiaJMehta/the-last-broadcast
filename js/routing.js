/**
 * routing.js — Mystery URL routing for The Last Broadcast
 * Owner: Pratyush
 *
 * GitHub Pages is a static host — there is no server-side routing.
 * Unknown URLs hit 404.html, which handles the redirect intercept.
 *
 * This module handles:
 *   1. Hash-based route detection (e.g. #sector-7)
 *   2. Click-based navigation for mystery links (data-route attributes)
 *   3. Programmatic route resolution
 */

function initRouting() {
  // Known mystery routes — destination is relative to site root
  const MYSTERY_ROUTES = {
    'sector-7': '/sector-7/',
    'signal-omega': '/sector-7/',
  };

  /**
   * Resolve base path for the site.
   * Handles both local dev (/) and GitHub Pages (/the-last-broadcast/).
   */
  function getBasePath() {
    const path = window.location.pathname;
    // If we're on a known page, strip the filename to get the base
    const knownPages = ['index.html', 'pages/', '404.html'];
    for (const page of knownPages) {
      const idx = path.indexOf(page);
      if (idx !== -1) return path.substring(0, idx);
    }
    // Fallback: if path ends with /, it's likely the base itself
    if (path.endsWith('/')) return path;
    // Otherwise strip last segment
    return path.substring(0, path.lastIndexOf('/') + 1);
  }

  /**
   * Navigate to a mystery route by key.
   * @param {string} routeKey — e.g. 'sector-7'
   */
  function navigateTo(routeKey) {
    const target = MYSTERY_ROUTES[routeKey];
    if (!target) return;
    window.location.href = target;
  }

  /**
   * Check if the current URL hash contains a mystery route.
   * e.g. #sector-7 or #signal-omega
   */
  function checkHashRoute() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && MYSTERY_ROUTES[hash]) {
      navigateTo(hash);
    }
  }

  /**
   * Bind click handlers to any element with [data-route].
   * Usage: <a data-route="sector-7">Enter Sector 7</a>
   */
  function bindRouteLinks() {
    document.querySelectorAll('[data-route]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        navigateTo(route);
      });
    });
  }

  // — Init —
  checkHashRoute();
  bindRouteLinks();

  // Also listen for hash changes (in case it changes after load)
  window.addEventListener('hashchange', checkHashRoute);
}

export { initRouting };