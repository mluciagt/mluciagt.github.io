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

/* ---------- lightbox gallery (pages with <main data-gallery>) ---------- */
(function () {
  var scope = document.querySelector('[data-gallery]');
  if (!scope) return;
  var imgs = Array.prototype.slice.call(scope.querySelectorAll('img'));
  var n = imgs.length;
  if (!n) return;

  var idx = 0, lastFocus = null, startX = null;

  var box = document.createElement('div');
  box.className = 'lb';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo gallery');
  box.innerHTML =
    '<button class="lb__btn lb__close" type="button" aria-label="Close"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 5L35 35M35 5L5 35"/></svg></button>' +
    '<button class="lb__btn lb__prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 48" aria-hidden="true"><path d="M20 4L4 24l16 20"/></svg></button>' +
    '<img class="lb__img" alt="">' +
    '<button class="lb__btn lb__next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 48" aria-hidden="true"><path d="M4 4l16 20L4 44"/></svg></button>';
  document.body.appendChild(box);

  var big = box.querySelector('.lb__img');
  var closeBtn = box.querySelector('.lb__close');
  var prevBtn = box.querySelector('.lb__prev');
  var nextBtn = box.querySelector('.lb__next');
  if (n < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }

  function src(i) { return imgs[i].currentSrc || imgs[i].src; }

  function show(i) {
    idx = (i + n) % n;
    big.src = src(idx);
    big.alt = imgs[idx].alt;
    if (n > 1) {
      new Image().src = src((idx + 1) % n);
      new Image().src = src((idx - 1 + n) % n);
    }
  }
  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    closeBtn.focus();
  }
  function close() {
    if (box.hidden) return;
    box.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  imgs.forEach(function (im, i) {
    im.tabIndex = 0;
    im.setAttribute('role', 'button');
    im.addEventListener('click', function () { open(i); });
    im.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(idx - 1); });
  nextBtn.addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });
})();