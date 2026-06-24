
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

  /* ── Stat triple-click easter egg (delegated) ───────── */
  (function() {
    var seqs = {
      '$900K': ['$1.1M','$1.4M','$1.8M','$2.3M','$2.9M'],
      '70%':   ['74%','79%','85%','91%','97%'],
      '4.5×': ['5.8×','7.2×','9.1×','11.2×','13.8×'],
      '?':     ['?!','∞','?!','∅','∞']
    };
    var style = document.createElement('style');
    style.textContent = '[data-bignum]{cursor:pointer}';
    document.head.appendChild(style);
    var state = {};
    document.addEventListener('click', function(e) {
      var el = e.target.closest ? e.target.closest('[data-bignum]') : null;
      if (!el) return;
      var key = el.textContent.trim();
      if (!state[key]) state[key] = { n: 0, t: null, on: false };
      var s = state[key];
      if (s.on) return;
      s.n++;
      clearTimeout(s.t);
      if (s.n < 3) { s.t = setTimeout(function() { s.n = 0; }, 600); return; }
      s.n = 0; s.on = true;
      var seq = seqs[key];
      if (!seq) { s.on = false; return; }
      var i = 0;
      var iv = setInterval(function() {
        if (i < seq.length) { el.textContent = seq[i++]; }
        else {
          clearInterval(iv);
          el.textContent = 'CRITICAL';
          el.style.color = '#fff';
          setTimeout(function() { el.textContent = key; el.style.color = '#E8634A'; s.on = false; }, 700);
        }
      }, 100);
    });
  })();

  /* ── rOS node fast-forward easter egg (delegated) ───── */
  (function() {
    var ff = false;
    document.addEventListener('click', function(e) {
      var target = e.target;
      var rosNode = null;
      while (target && target !== document) {
        if (target.classList && target.classList.contains('loop-node') && target.getAttribute('data-i') === '4') {
          rosNode = target; break;
        }
        target = target.parentNode;
      }
      if (!rosNode) return;
      if (ff) return;
      var stage = document.getElementById('loop-stage');
      if (!stage) return;
      ff = true;
      var nodes = Array.from(stage.querySelectorAll('.loop-node')).sort(function(a,b){return +a.getAttribute('data-i') - +b.getAttribute('data-i');});
      var edges = Array.from(stage.querySelectorAll('.loop-edge')).sort(function(a,b){return +a.getAttribute('data-i') - +b.getAttribute('data-i');});
      nodes.forEach(function(g) {
        var ring=g.querySelector('.ring'),dot=g.querySelector('.dot'),halo=g.querySelector('.halo'),labs=g.querySelectorAll('.nlab');
        if(ring){ring.style.transition='none';ring.style.stroke='rgba(255,255,255,0.3)';}
        if(halo){halo.style.transition='none';halo.style.opacity='0';}
        if(dot){dot.style.transition='none';dot.style.opacity='0';dot.style.animation='none';}
        labs.forEach(function(l){l.style.transition='none';l.style.fill='rgba(255,255,255,0.4)';});
      });
      edges.forEach(function(e){e.style.transition='none';e.style.strokeDashoffset='100';});
      var T = 55;
      nodes.forEach(function(n) {
        setTimeout(function() {
          var ring=n.querySelector('.ring'),dot=n.querySelector('.dot'),halo=n.querySelector('.halo'),labs=n.querySelectorAll('.nlab');
          if(ring){ring.style.transition='stroke 0.1s';ring.style.stroke='#E8634A';}
          if(halo){halo.style.transition='opacity 0.12s';halo.style.opacity='0.4';}
          if(dot){dot.style.transition='opacity 0.1s';dot.style.opacity='1';}
          labs.forEach(function(l){l.style.transition='fill 0.1s';l.style.fill='#fff';});
        }, 30 + (+n.getAttribute('data-i')) * T);
      });
      edges.forEach(function(e) {
        var i = +e.getAttribute('data-i');
        setTimeout(function(){e.style.transition='stroke-dashoffset 0.15s ease';e.style.strokeDashoffset='0';}, 30+(i<4?i*T+30:5*T));
      });
      setTimeout(function() {
        var dot=rosNode.querySelector('.dot'),halo=rosNode.querySelector('.halo');
        if(dot){dot.style.animation='rs-pulse 0.55s ease';}
        if(halo){halo.style.opacity='0.8';setTimeout(function(){halo.style.opacity='0.4';},300);}
        setTimeout(function(){ff=false;},1200);
      }, 30+5*T+80);
    });
    var style = document.createElement('style');
    style.textContent = '.loop-node[data-i="4"]{cursor:pointer}';
    document.head.appendChild(style);
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
