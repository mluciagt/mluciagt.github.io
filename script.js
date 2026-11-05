(function () {
  var btn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (!btn || !menu) return;

  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
})();
