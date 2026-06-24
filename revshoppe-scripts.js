
(function() {
      var items = document.querySelectorAll('.quote-item');
      items.forEach(function(i) { i.classList.remove('open'); });
      var randomIdx = Math.floor(Math.random() * items.length);
      if (items[randomIdx]) items[randomIdx].classList.add('open');

      document.querySelectorAll('.quote-trigger').forEach(function(trigger) {
        function handleQuote(e) {
          e.preventDefault();
          e.stopPropagation();
          var item = trigger.closest('.quote-item');
          var isOpen = item.classList.contains('open');
          items.forEach(function(i) { i.classList.remove('open'); });
          if (!isOpen) item.classList.add('open');
        }
        trigger.addEventListener('click', handleQuote);
        trigger.addEventListener('touchstart', handleQuote, { passive: false });
      });
    })();

(function() {

  var originalTitle = document.title;
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      document.title = 'Your GTM misses you.';
    } else {
      document.title = 'Welcome back.';
      setTimeout(function() { document.title = originalTitle; }, 10000);
    }
  });

  var dayMessages = {
    0: 'Sunday. Thinking about Monday already?',
    1: "It's Monday. Forecast due Friday.",
    2: 'Tuesday. Pipeline review is tomorrow.',
    3: "Wednesday. Halfway to the number.",
    4: 'Thursday. One day to clean up the forecast.',
    5: "It's Friday. How's the number?",
    6: "Saturday. Even GTM takes a breath."
  };
  var day = new Date().getDay();
  var eyebrow = document.querySelector('.eyebrow');
  if (eyebrow && dayMessages[day]) {
    var original = eyebrow.textContent;
    eyebrow.setAttribute('data-original', original);
    eyebrow.setAttribute('title', 'GTM · Strategy · Engineering · Governance');
    setTimeout(function() {
      eyebrow.style.transition = 'opacity 0.6s ease';
      eyebrow.style.opacity = '0';
      setTimeout(function() {
        eyebrow.textContent = dayMessages[day];
        eyebrow.style.opacity = '1';
        setTimeout(function() {
          eyebrow.style.opacity = '0';
          setTimeout(function() {
            eyebrow.textContent = original;
            eyebrow.style.opacity = '1';
          }, 600);
        }, 4000);
      }, 600);
    }, 1200);
  }

  /* ── Stat triple-click easter egg ───────────────────── */
  (function() {
    var seqs = {
      '$900K': ['$1.1M','$1.4M','$1.8M','$2.3M','$2.9M'],
      '70%':   ['74%','79%','85%','91%','97%'],
      '4.5×':  ['5.8×','7.2×','9.1×','11.2×','13.8×'],
      '?':     ['?!','∞','?!','∅','∞']
    };
    document.querySelectorAll('[data-bignum]').forEach(function(el) {
      var clicks = 0, timer = null, active = false;
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() {
        if (active) return;
        clicks++;
        clearTimeout(timer);
        if (clicks < 3) { timer = setTimeout(function() { clicks = 0; }, 600); return; }
        clicks = 0;
        active = true;
        var orig = el.textContent.trim();
        var seq = seqs[orig];
        if (!seq) { active = false; return; }
        var i = 0;
        var iv = setInterval(function() {
          if (i < seq.length) {
            el.textContent = seq[i++];
          } else {
            clearInterval(iv);
            el.textContent = 'CRITICAL';
            el.style.color = '#fff';
            setTimeout(function() { el.textContent = orig; el.style.color = '#E8634A'; active = false; }, 700);
          }
        }, 100);
      });
    });
  })();

  window.triggerChaos = function() {
    if (document.getElementById('rs-cx')) return;
    var f = document.createElement('div');
    f.id = 'rs-cx';
    f.style.cssText = 'position:fixed;inset:0;z-index:9998;background:#E8634A;opacity:0;pointer-events:none;';
    document.body.appendChild(f);
    var seq = [0.85, 0, 0.65, 0, 0.9, 0, 0.45, 0], si = 0;
    (function flick() {
      if (si >= seq.length) {
        f.style.opacity = 0;
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#100F16;border-bottom:1px solid rgba(232,99,74,0.4);padding:16px 32px;display:flex;align-items:center;justify-content:space-between;transform:translateY(-100%);transition:transform .35s cubic-bezier(.2,.7,.2,1);pointer-events:none;';
        toast.innerHTML = '<span style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#E8634A;">GTM Decay Detected</span><span style="font-family:\'IBM Plex Mono\',monospace;font-size:10px;color:rgba(255,255,255,.28);letter-spacing:.1em;">You already knew.</span>';
        document.body.appendChild(toast);
        requestAnimationFrame(function() {
          toast.style.transform = 'translateY(0)';
          setTimeout(function() {
            toast.style.transform = 'translateY(-100%)';
            setTimeout(function() { toast.remove(); f.remove(); }, 350);
          }, 2800);
        });
        return;
      }
      f.style.opacity = seq[si++];
      setTimeout(flick, 80);
    })();
  };

})();
