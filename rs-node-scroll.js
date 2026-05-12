/* ============================================================
   RevShoppe — Node Scroll Pattern controller
   Lights the card nearest viewport center, marks earlier cards
   as 'past', draws the trail to the current step, fires the
   feedback arc when the last step is reached.

   Usage:
     <script src="node-scroll-pattern.js" defer></script>
     Initializes any element with class .rs-trunk-stage on DOMReady.

   Expected DOM contract (per stage):
     .rs-trunk-stage
       svg.rs-trunk-spine
         line.rs-trunk-trail
         g.rs-trunk-node[data-step="1..N"]
         path.rs-trunk-arc      (optional)
         text.rs-trunk-arc-lbl  (optional)
       .rs-trunk-cards
         .rs-trunk-card[data-step="1..N"]
   ============================================================ */
(function () {
  function initStage(stage) {
    var trail  = stage.querySelector('.rs-trunk-trail');
    var nodes  = stage.querySelectorAll('.rs-trunk-node');
    var cards  = stage.querySelectorAll('.rs-trunk-card');
    var arc    = stage.querySelector('.rs-trunk-arc');
    var arcLbl = stage.querySelector('.rs-trunk-arc-lbl');
    if (!cards.length) return;

    // Configurable spine geometry — defaults match the 1080×1500 viewBox.
    // Override via data-attributes on the stage if your viewBox differs.
    var TRAIL_TOTAL = +stage.dataset.trailTotal || 1340; // path length
    var TRAIL_START = +stage.dataset.trailStart || 60;   // y of first node anchor
    var NODE_SPACING = +stage.dataset.nodeSpacing || 140; // y delta between nodes
    var NODE_FIRST_Y = +stage.dataset.nodeFirstY || 120; // y of step 1

    var totalSteps = cards.length;
    var active = 0;
    var progress = 0;
    var ticking = false;

    function compute() {
      var vh = window.innerHeight;
      var center = vh * 0.5;
      var first = cards[0].getBoundingClientRect();
      var last  = cards[totalSteps - 1].getBoundingClientRect();
      var firstY = first.top + first.height * 0.5;
      var lastY  = last.top  + last.height  * 0.5;

      if (firstY > center) { active = 0; progress = 0; return; }
      if (lastY  < center) { active = totalSteps; progress = totalSteps; return; }

      var p = 0, nearest = 1, nearestD = Infinity;
      for (var i = 0; i < totalSteps; i++) {
        var r = cards[i].getBoundingClientRect();
        var y = r.top + r.height * 0.5;
        var d = Math.abs(y - center);
        if (d < nearestD) { nearestD = d; nearest = +cards[i].dataset.step; }
      }
      for (var j = 0; j < totalSteps - 1; j++) {
        var a = cards[j].getBoundingClientRect();
        var b = cards[j + 1].getBoundingClientRect();
        var ay = a.top + a.height * 0.5;
        var by = b.top + b.height * 0.5;
        if (center >= ay && center <= by) {
          var t = (center - ay) / (by - ay);
          p = (+cards[j].dataset.step) + t;
          break;
        }
      }
      if (p === 0) p = nearest;
      active = nearest;
      progress = p;
    }

    function update() {
      cards.forEach(function (card) {
        var s = +card.dataset.step;
        card.classList.toggle('past', s < active);
        card.classList.toggle('lit',  s === active);
      });
      nodes.forEach(function (node) {
        var s = +node.dataset.step;
        node.classList.toggle('lit', s <= active && active > 0);
      });

      if (trail) {
        if (progress <= 0) {
          trail.style.strokeDashoffset = TRAIL_TOTAL;
        } else {
          var nodeY = NODE_FIRST_Y + (progress - 1) * NODE_SPACING;
          var drawn = Math.max(0, Math.min(TRAIL_TOTAL, nodeY - TRAIL_START));
          trail.style.strokeDashoffset = TRAIL_TOTAL - drawn;
        }
      }

      if (arc) {
        var on = active >= totalSteps;
        arc.classList.toggle('draw', on);
        arc.style.strokeDashoffset = on ? 0 : '';
        arc.style.opacity = on ? 0.95 : '';
        if (arcLbl) arcLbl.style.opacity = on ? 1 : '';
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        compute();
        update();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  function boot() {
    document.querySelectorAll('.rs-trunk-stage').forEach(initStage);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
