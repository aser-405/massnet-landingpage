(() => {
  const root = document.documentElement;
  root.classList.add('is-loading');
  const started = Date.now();
  function dismiss() {
    root.classList.remove('is-loading');
    const loader = document.getElementById('page-loader');
    if (loader) loader.setAttribute('aria-hidden', 'true');
  }
  window.addEventListener('load', () => setTimeout(dismiss, Math.max(0, 750 - (Date.now() - started))), {once:true});
  window.addEventListener('pageshow', event => {if(event.persisted) dismiss();});
  setTimeout(dismiss, 4000); // A failed image must never trap visitors.
})();
