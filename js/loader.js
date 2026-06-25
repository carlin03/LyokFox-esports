/* Quita el loader aunque falle otro script */
(function () {
  function dismiss() {
    if (document.body) document.body.classList.add('ready');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismiss);
  } else {
    dismiss();
  }
  setTimeout(dismiss, 350);
  window.addEventListener('load', dismiss);
})();
