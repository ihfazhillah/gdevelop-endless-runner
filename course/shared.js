/* === JS untuk course: tabs, quiz, hands-on checklist, copy, highlight === */
(function () {
  // Diataxis tabs
  document.querySelectorAll('.diataxis-tabs').forEach(function (tabbar) {
    tabbar.querySelectorAll('.diataxis-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panelId = btn.dataset.panel;
        tabbar.querySelectorAll('.diataxis-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var host = tabbar.parentElement;
        host.querySelectorAll('.diataxis-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel = host.querySelector('#' + panelId);
        if (panel) panel.classList.add('active');
        // simpan tab aktif per halaman (+ per module agar tidak bentrok di course.html)
        var moduleId = (btn.closest('.course-module') || {}).id || 'page';
        try { localStorage.setItem('sc-tab-' + location.pathname + '-' + moduleId, panelId); } catch (e) {}
      });
    });
    // restore tab aktif
    try {
      var moduleId = (tabbar.closest('.course-module') || {}).id || 'page';
      var saved = localStorage.getItem('sc-tab-' + location.pathname + '-' + moduleId);
      if (saved) {
        var savedBtn = tabbar.querySelector('[data-panel="' + saved + '"]');
        if (savedBtn) savedBtn.click();
      }
    } catch (e) {}
  });

  // Hands-on checklist (progress disimpan localStorage, scope per module di course.html)
  document.querySelectorAll('.hand-on').forEach(function (box) {
    var mod = (box.closest('.course-module') || {}).id || 'page';
    var key = 'sc-handon-' + location.pathname + '-' + mod + '-' + box.id;
    var bar = box.querySelector('.hand-on-progress-bar');
    var label = box.querySelector('.hand-on-progress');
    var steps = box.querySelectorAll('.hand-on-step');
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    function render() {
      var done = 0;
      steps.forEach(function (s, i) {
        var isDone = saved.indexOf(i) !== -1;
        s.classList.toggle('done', isDone);
        if (isDone) done++;
      });
      var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
      if (bar) bar.style.width = pct + '%';
      if (label) label.textContent = done + ' / ' + steps.length + ' selesai';
    }
    steps.forEach(function (s, i) {
      s.querySelector('.hand-on-check').addEventListener('click', function () {
        var idx = saved.indexOf(i);
        if (idx === -1) saved.push(i); else saved.splice(idx, 1);
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
        render();
      });
    });
    render();
  });

  // Quiz
  document.querySelectorAll('.quiz-block').forEach(function (block) {
    var opts = block.querySelectorAll('.quiz-opt');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (block.classList.contains('revealed')) return;
        var correct = opt.dataset.correct === 'true';
        opts.forEach(function (o) {
          o.classList.add('disabled');
          if (o.dataset.correct === 'true') o.classList.add('correct');
        });
        if (!correct) opt.classList.add('wrong');
        block.classList.add('revealed');
      });
    });
  });

  // Copy button pada code-block
  document.querySelectorAll('.code-block').forEach(function (block) {
    var pre = block.querySelector('pre');
    if (!pre) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'salin';
    // geser filename agar tidak bentrok dengan tombol salin
    var fn = block.querySelector('.filename');
    if (fn) fn.style.right = '70px';
    btn.addEventListener('click', function () {
      var text = pre.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'tersalin ✓';
          setTimeout(function () { btn.textContent = 'salin'; }, 1500);
        });
      }
    });
    block.appendChild(btn);
  });

  // Syntax highlight TIDAK di sisi klien lagi — di-preprocess saat build
  // (lihat build_highlight.py). Span <pre class="py"> sudah siap di HTML.
  // Untuk berjaga-jaga <pre class="py"> tanpa span (file lama), beri class polos.
  document.querySelectorAll('pre.py').forEach(function (pre) {
    if (!pre.innerHTML.match(/<span/)) pre.classList.add('plain');
  });

  // Quiz — engine generic (pola cisokan-obia): pilihan ganda dengan tombol Periksa/Ulangi,
  // feedback benar/salah dengan penjelasan. Bisa beberapa <div class="quiz-container">.
  function setOpt(btn) {
    var block = btn.closest('.quiz-question-block');
    [].forEach.call(block.querySelectorAll('.quiz-option'), function (o) { o.classList.remove('selected'); });
    btn.classList.add('selected');
  }
  function checkQuiz(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    [].forEach.call(container.querySelectorAll('.quiz-question-block'), function (q) {
      var selected = q.querySelector('.quiz-option.selected');
      var feedback = q.querySelector('.quiz-feedback');
      var correct  = q.dataset.correct;
      if (!selected) {
        feedback.innerHTML = '<strong>Sisihkan jawaban dulu!</strong>';
        feedback.className = 'quiz-feedback show warning';
        return;
      }
      [].forEach.call(q.querySelectorAll('.quiz-option'), function (o) { o.disabled = true; });
      if (selected.dataset.value === correct) {
        selected.classList.add('correct');
        feedback.innerHTML = '<strong>Benar!</strong> ' + (q.dataset.explanationRight || '');
        feedback.className = 'quiz-feedback show success';
      } else {
        selected.classList.add('incorrect');
        var rightBtn = q.querySelector('.quiz-option[data-value="' + correct + '"]');
        if (rightBtn) rightBtn.classList.add('correct');
        feedback.innerHTML = '<strong>Belum tepat.</strong> ' + (q.dataset.explanationWrong || '');
        feedback.className = 'quiz-feedback show error';
      }
    });
  }
  function resetQuiz(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    [].forEach.call(container.querySelectorAll('.quiz-option'), function (o) {
      o.classList.remove('selected', 'correct', 'incorrect'); o.disabled = false;
    });
    [].forEach.call(container.querySelectorAll('.quiz-feedback'), function (f) {
      f.className = 'quiz-feedback'; f.innerHTML = '';
    });
  }
  [].forEach.call(document.querySelectorAll('.quiz-container'), function (c) {
    [].forEach.call(c.querySelectorAll('.quiz-option'), function (o) {
      o.addEventListener('click', function () { setOpt(o); });
    });
    var cid = c.id;
    var btns = c.querySelectorAll('.quiz-check-btn, .quiz-reset-btn');
    [].forEach.call(btns, function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('quiz-check-btn')) checkQuiz(cid);
        else resetQuiz(cid);
      });
    });
  });

  // Tooltip istilah (term)
  document.querySelectorAll('.term').forEach(function (el) {
    el.style.borderBottom = '1px dashed var(--color-accent-muted)';
    el.style.cursor = 'help';
    el.title = el.dataset.def || '';
  });

  // Flow animation: tunjukkan langkah satu per satu (tombol "Langkah berikutnya")
  document.querySelectorAll('.flow-animation').forEach(function (box) {
    var btn = box.querySelector('.flow-next');
    if (!btn) return;
    var steps = box.querySelectorAll('.flow-step');
    var names = (box.dataset.steps || '').split('\u2192');
    function build() {
      box.innerHTML = '';
      names.forEach(function (name, i) {
        var d = document.createElement('div');
        d.className = 'flow-step' + (i === 0 ? ' show' : '');
        d.textContent = (i + 1) + '. ' + name.trim();
        box.appendChild(d);
      });
      var b = document.createElement('button');
      b.className = 'flow-next';
      b.textContent = 'Langkah berikutnya \u2192';
      box.appendChild(b);
      var idx = 0;
      var all = box.querySelectorAll('.flow-step');
      b.addEventListener('click', function () {
        if (idx >= all.length - 1) { b.classList.add('finished'); b.textContent = '✓ selesai'; return; }
        all[idx].classList.add('done');
        idx++;
        all[idx].classList.add('show');
      });
    }
    if (box.dataset.steps) build(); else if (steps.length) {
      var idx = 0;
      btn.addEventListener('click', function () {
        if (idx >= steps.length - 1) { btn.classList.add('finished'); btn.textContent = '✓ selesai'; return; }
        steps[idx].classList.add('done');
        idx++;
        steps[idx].classList.add('show');
      });
    }
  });

  // progress halaman (bar atas)
  var topbar = document.createElement('div');
  topbar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--color-accent);z-index:2000;width:0%;transition:width .1s linear';
  document.body.appendChild(topbar);
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100;
    topbar.style.width = pct + '%';
  });
})();
/* === Lightbox gambar demo (kursus anak: klik gambar → lihat besar) === */
(function () {
  var overlay = null;
  function makeOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'img-lightbox';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(30,20,40,0.92);z-index:5000;' +
      'display:none;align-items:center;justify-content:center;cursor:zoom-out;padding:24px';
    var img = document.createElement('img');
    img.style.cssText = 'max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5)';
    overlay.appendChild(img);
    overlay.addEventListener('click', function () { overlay.style.display = 'none'; });
    document.body.appendChild(overlay);
  }
  document.addEventListener('click', function (e) {
    var img = e.target.closest('.figure img');
    if (!img) return;
    // gambar yang sudah jadi media (poster video) tidak dibuka di lightbox;
    // dia diputar via wrap handler → video.
    if (img.closest('.gdev-media')) return;
    if (!overlay) makeOverlay();
    overlay.querySelector('img').src = img.currentSrc || img.src;
    overlay.querySelector('img').alt = img.alt || '';
    overlay.style.display = 'flex';
  });
})();
/* === GDevelop-media: poster + video on-demand (gabungan gambar & video) ===
   Setiap <img data-clip="...mp4"> di dalam .figure menjadi media stack:
   klik ▶ menyisipkan <video controls muted playsinline preload="none"> (no audio).
   Klik ✕ / pemutaran selesai → kembali ke poster. */
(function () {
  document.querySelectorAll('.figure img[data-clip]').forEach(function (img) {
    var fig = img.closest('.figure');
    if (!fig || fig.classList.contains('gdev-media')) return;
    var clip = img.dataset.clip;
    fig.classList.add('gdev-media');
    // bungkus img dalam poster-wrap
    var wrap = document.createElement('div');
    wrap.className = 'poster-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    // tombol play
    var btn = document.createElement('button');
    btn.className = 'play-btn';
    btn.setAttribute('aria-label', 'Putar video demo');
    btn.innerHTML = '&#9654;';
    wrap.appendChild(btn);
    // hint
    var hint = document.createElement('span');
    hint.className = 'play-hint';
    hint.textContent = '&#9654; lihat video aslinya';
    hint.innerHTML = '&#9654; lihat video aslinya';
    wrap.appendChild(hint);
    // click poster/btn -> play video
    function openVideo() {
      if (fig.querySelector('video')) return;  // sudah terbuka
      var v = document.createElement('video');
      v.src = clip;
      v.controls = true;
      v.muted = true;
      v.playsInline = true;
      v.preload = 'none';
      v.loop = false;
      var close = document.createElement('button');
      close.className = 'media-close';
      close.setAttribute('aria-label', 'Tutup video');
      close.innerHTML = '&#10005;';
      close.addEventListener('click', closeVideo);
      fig.insertBefore(v, wrap.nextSibling);
      fig.insertBefore(close, wrap.nextSibling);
      wrap.style.display = 'none';
      hint.style.display = 'none';
      v.play().catch(function(){});
      v.addEventListener('ended', closeVideo);
    }
    function closeVideo() {
      var v = fig.querySelector('video');
      var c = fig.querySelector('.media-close');
      if (v) { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }
      if (c) c.remove();
      wrap.style.display='';
      hint.style.display='';
    }
    btn.addEventListener('click', openVideo);
    // klik di mana pun pada poster (termasuk gambar) → putar video;
    // lightbox di-abaikan untuk .gdev-media (lihat lightbox handler).
    wrap.addEventListener('click', openVideo);
  });
})();
