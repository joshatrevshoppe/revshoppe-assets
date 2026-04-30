(function() {
  var btn = document.getElementById('nav-hamburger');
  var drawer = document.getElementById('nav-mobile');
  if (!btn || !drawer) return;

  /* Set inline so no CSS cascade can override it */
  btn.style.touchAction = 'manipulation';
  btn.style.webkitTapHighlightColor = 'transparent';

  var busy = false;
  function open(e) {
    if (e && e.cancelable) e.preventDefault();
    if (busy) return;
    busy = true;
    setTimeout(function() { busy = false; }, 400);
    var isOpen = btn.classList.toggle('open');
    drawer.style.display = isOpen ? 'flex' : 'none';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn.addEventListener('touchend', open, { passive: false });
  btn.addEventListener('click', open);

  drawer.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      btn.classList.remove('open');
      drawer.style.display = 'none';
      document.body.style.overflow = '';
    });
  });
})();

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

  var logoLink = document.querySelector('a.logo');
  var clickCount = 0;
  var clickTimer = null;

  if (logoLink && window.location.pathname === '/') {
logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount < 3) {
        clickTimer = setTimeout(function() {
          clickCount = 0;
          window.location.href = logoLink.href;
        }, 600);
        return;
      }

      if (clickCount >= 3) {
        clickCount = 0;
        clearTimeout(clickTimer);
        var boltImg = logoLink.querySelector('img');
        var tagline = document.querySelector('.ft-tagline');

        if (boltImg) {
          boltImg.style.transition = 'filter 0.15s ease, transform 0.15s ease';
          var flashes = 0;
          var flash = setInterval(function() {
            flashes++;
            boltImg.style.filter = flashes % 2 === 0
              ? 'brightness(1) drop-shadow(0 0 8px #E8634A)'
              : 'brightness(2) drop-shadow(0 0 16px #fff)';
            boltImg.style.transform = flashes % 2 === 0 ? 'scale(1.1)' : 'scale(1)';
            if (flashes >= 6) {
              clearInterval(flash);
              boltImg.style.filter = '';
              boltImg.style.transform = '';
            }
          }, 100);
        }

        if (tagline) {
          var orig = tagline.textContent;
          tagline.style.transition = 'opacity 0.3s ease, color 0.3s ease';
          tagline.style.opacity = '0';
          setTimeout(function() {
            tagline.textContent = 'Charged.';
            tagline.style.color = '#E8634A';
            tagline.style.opacity = '1';
            setTimeout(function() {
              tagline.style.opacity = '0';
              setTimeout(function() {
                tagline.textContent = orig;
                tagline.style.color = '';
                tagline.style.opacity = '1';
              }, 400);
            }, 2500);
          }, 300);
        }
      }
    });
  }

  document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) { triggerDiagnosis(); }
  });
  document.addEventListener('webkitfullscreenchange', function() {
    if (document.webkitFullscreenElement) { triggerDiagnosis(); }
  });

  window.triggerDiagnosis = function triggerDiagnosis() {
    var rain = document.createElement('canvas');
    rain.style.cssText = 'position:fixed;inset:0;z-index:9998;background:#000;opacity:0;transition:opacity 0.2s ease;';
    document.body.appendChild(rain);
    var ctx = rain.getContext('2d');
    rain.width = window.innerWidth;
    rain.height = window.innerHeight;
    var cols = Math.floor(rain.width / 16);
    var drops = Array(cols).fill(0).map(function() { return Math.random() * -50; });
    var chars = '01';
    var frameCount = 0;
    var maxFrames = 95;
    requestAnimationFrame(function() { rain.style.opacity = '1'; });
    function drawRain() {
      frameCount++;
      var fade = frameCount < maxFrames * 0.85 ? 0.05 : 0.2;
      ctx.fillStyle = 'rgba(0,0,0,' + fade + ')';
      ctx.fillRect(0, 0, rain.width, rain.height);
      ctx.font = '14px "IBM Plex Mono", monospace';
      drops.forEach(function(y, i) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        var x = i * 16;
        ctx.fillStyle = '#E8634A';
        ctx.fillText(char, x, y * 16);
        ctx.fillStyle = 'rgba(232,99,74,0.25)';
        for (var t = 1; t < 4; t++) {
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - t) * 16);
        }
        if (y * 16 > rain.height && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.75;
      });
      if (frameCount < maxFrames) {
        setTimeout(drawRain, 40);
      } else {
        rain.style.transition = 'opacity 0.4s ease';
        rain.style.opacity = '0';
        setTimeout(function() { rain.remove(); buildAndShowOverlay(); }, 400);
      }
    }
    drawRain();

    function buildAndShowOverlay() {
      var overlay = document.createElement('div');
      overlay.id = 'gtm-diagnosis-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(250,250,249,0.98);z-index:9999;cursor:default;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:"IBM Plex Mono",monospace;color:#111;padding:48px;overflow:auto;opacity:0;transition:opacity 0.4s ease;';
      var w = window.innerWidth, h = window.innerHeight;
      var ua = navigator.userAgent;
      var device = /Mobile|iPhone|Android/i.test(ua) ? 'Mobile' : 'Desktop';
      var browser = /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : /Firefox/i.test(ua) ? 'Firefox' : /Edge/i.test(ua) ? 'Edge' : 'Unknown';
      var scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0;
      var score = Math.floor(Math.random() * 30 + 55);
      var findings = [
        { pillar: 'Context', val: Math.floor(Math.random()*40+20)+'%', label: 'Signal-to-noise ratio', status: 'CRITICAL' },
        { pillar: 'Data', val: Math.floor(Math.random()*60+20)+'%', label: 'CRM record completeness', status: 'AT RISK' },
        { pillar: 'People', val: (Math.random()*2+0.8).toFixed(2)+'×', label: 'Activity-to-pipeline ratio', status: 'BELOW MEDIAN' },
        { pillar: 'Technology', val: Math.floor(Math.random()*5+8)+'', label: 'Tools in stack', status: 'UNCONNECTED' },
      ];
      var html = '<div style="max-width:680px;width:100%;">';
      html += '<div style="font-size:9px;letter-spacing:0.2em;color:#E8634A;margin-bottom:24px;">REVSHOPPE · GTM DIAGNOSIS · LIVE SESSION SCAN</div>';
      html += '<div style="font-size:clamp(18px,3vw,28px);font-family:RocWideMedium,sans-serif;color:#111;margin-bottom:8px;">GTM Diagnosis Complete.</div>';
      html += '<div style="font-size:13px;color:rgba(0,0,0,0.4);margin-bottom:40px;">Based on your current session. Results are approximate.</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:1px;background:rgba(0,0,0,0.05);margin-bottom:32px;border-radius:8px;overflow:hidden;">';
      [{l:'Device',v:device},{l:'Browser',v:browser},{l:'Viewport',v:w+'×'+h},{l:'Page Read',v:scrollPct+'%'}].forEach(function(s) {
        html += '<div style="background:rgba(0,0,0,0.03);padding:16px 20px;"><div style="font-size:8px;letter-spacing:0.14em;color:rgba(0,0,0,0.35);text-transform:uppercase;margin-bottom:6px;">'+s.l+'</div><div style="font-size:15px;color:#111;">'+s.v+'</div></div>';
      });
      html += '</div><div style="display:flex;flex-direction:column;gap:1px;margin-bottom:32px;">';
      findings.forEach(function(f) {
        html += '<div style="display:flex;align-items:center;background:rgba(0,0,0,0.03);padding:14px 20px;border-radius:4px;"><div style="font-size:8px;letter-spacing:0.14em;color:rgba(232,99,74,0.7);text-transform:uppercase;width:90px;flex-shrink:0;">'+f.pillar+'</div><div style="flex:1;font-size:12px;color:rgba(0,0,0,0.5);">'+f.label+'</div><div style="font-size:16px;color:#111;margin:0 20px;">'+f.val+'</div><div style="font-size:8px;letter-spacing:0.1em;color:rgba(232,99,74,0.9);border:1px solid rgba(232,99,74,0.3);padding:3px 8px;border-radius:100px;">'+f.status+'</div></div>';
      });
      html += '</div><div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(0,0,0,0.08);padding-top:24px;">';
      html += '<div style="font-size:9px;letter-spacing:0.14em;color:rgba(0,0,0,0.25);text-transform:uppercase;">System operating at '+score+'% of potential</div>';
      html += '<a href="https://revshoppe.com/contact" style="background:#E8634A;color:#fff;text-decoration:none;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:12px 24px;border-radius:6px;">Book a Real One →</a>';
      html += '</div><div style="text-align:center;margin-top:28px;font-size:9px;color:rgba(0,0,0,0.2);letter-spacing:0.1em;">PRESS ESC OR CLICK ANYWHERE TO CLOSE</div></div>';
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
      requestAnimationFrame(function() { overlay.style.opacity = '1'; });
      function close() { overlay.style.opacity = '0'; setTimeout(function() { overlay.remove(); }, 400); }
      overlay.addEventListener('click', function(e) { if (e.target.closest('a')) return; close(); });
      document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    }
  };

  window.gtmDiagnosisStart = Date.now();

  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var konamiIdx = 0;
  document.addEventListener('keydown', function(e) {
    if (e.key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) { konamiIdx = 0; triggerDiagnosis(); }
    } else { konamiIdx = 0; }
  });

  (function() {
    var greenDot = document.getElementById('readout-fullscreen-btn');
    if (greenDot) {
      greenDot.addEventListener('click', function() { triggerDiagnosis(); });
    }
  })();

})();
