/* زر التثبيت في الأعلى + رسالة التثبيت: تلقائياً أول مرة ثم بزر التثبيت */
(function() {
  if (location.protocol.indexOf('http') !== 0 || window.self !== window.top) { return; }
  try {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) { return; }
  } catch (e) { return; }
  var KEY = 'naqla-install-seen';
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'install.css';
  document.head.appendChild(link);
  var deferred = null;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var hb = document.getElementById('installBtn');
  function firstVisit() {
    try { return !localStorage.getItem(KEY); } catch (e) { return true; }
  }
  function markSeen() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function revealHb() { if (hb) { hb.classList.add('show'); } }
  function hideHb() { if (hb) { hb.classList.remove('show'); } }
  function show(manual) {
    if (document.querySelector('.naqla-install')) { return; }
    var wrap = document.createElement('div');
    wrap.className = 'naqla-install';
    var btns = manual
      ? '<div class="naqla-install-btns"><button class="naqla-install-no" type="button">فهمت</button></div>'
      : '<div class="naqla-install-btns"><button class="naqla-install-go" type="button">تثبيت التطبيق</button><button class="naqla-install-no" type="button">لاحقاً</button></div>';
    var hint = manual ? 'من زر المشاركة اختر «إضافة إلى الشاشة الرئيسية»' : 'يمكنك تنزيل الموقع كتطبيق على جهازك';
    wrap.innerHTML = '<div class="naqla-install-card"><img src="icons/icon-192.png" alt="مبادرة نقلة ذكية"><div class="naqla-install-txt"><b>مبادرة نقلة ذكية</b><span>' + hint + '</span>' + btns + '</div><button class="naqla-install-x" type="button" aria-label="إغلاق">✕</button></div>';
    document.body.appendChild(wrap);
    function close() { wrap.classList.add('hide'); }
    wrap.querySelector('.naqla-install-x').addEventListener('click', close);
    var no = wrap.querySelector('.naqla-install-no');
    if (no) { no.addEventListener('click', close); }
    var go = wrap.querySelector('.naqla-install-go');
    if (go) {
      go.addEventListener('click', function() {
        if (deferred) { deferred.prompt(); }
      });
    }
  }
  revealHb();
  if (hb) {
    hb.addEventListener('click', function() {
      if (deferred) { show(false); }
      else { show(isIOS); }
    });
  }
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferred = e;
    if (firstVisit()) {
      setTimeout(function() { show(false); markSeen(); }, 2000);
    }
  });
  window.addEventListener('appinstalled', function() {
    hideHb();
    var w = document.querySelector('.naqla-install');
    if (w) { w.classList.add('hide'); }
  });
  if (isIOS && firstVisit()) {
    setTimeout(function() { show(true); markSeen(); }, 2500);
  }
})();
