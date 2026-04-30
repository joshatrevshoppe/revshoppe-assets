(function () {
  var PORTAL = '5046646';
  var FORM   = 'eeb869db-230f-4963-a0bc-564c2c8244e5';

  var CSS = [
    /* form card */
    '.ccr-card{background:#1A1825;border:1px solid rgba(255,255,255,.08);border-top:3px solid #E8634A;border-radius:10px;padding:40px 36px;box-shadow:0 16px 48px rgba(0,0,0,.35),0 4px 16px rgba(0,0,0,.25);}',
    '@media(max-width:480px){.ccr-card{padding:28px 20px;}}',
    '.ccr-card-label{display:block;font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#E8634A;margin-bottom:12px;}',
    '.ccr-card-title{font-family:RocWideMedium,sans-serif;font-size:22px;letter-spacing:-.5px;color:#fff;margin-bottom:8px;line-height:1.3;}',
    '.ccr-card-sub{font-family:Montserrat,sans-serif;font-size:13px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:24px;}',
    /* HubSpot field overrides */
    '#hs-ccr-form .hs-form-private input::placeholder,#hs-ccr-form .hs-form-private textarea::placeholder{color:rgba(255,255,255,.18)!important;}',
    '#hs-ccr-form .hs-form-private input,#hs-ccr-form .hs-form-private select,#hs-ccr-form .hs-form-private textarea{background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:3px!important;color:rgba(255,255,255,.85)!important;font-family:Montserrat,sans-serif!important;font-size:13px!important;font-weight:400!important;padding:10px 14px!important;width:100%!important;}',
    '#hs-ccr-form .hs-form-private label{font-family:"IBM Plex Mono",monospace!important;font-size:9px!important;font-weight:400!important;letter-spacing:.1em!important;text-transform:uppercase!important;color:rgba(255,255,255,.4)!important;}',
    '#hs-ccr-form .hs-form-private fieldset{max-width:100%!important;border:none!important;}',
    '#hs-ccr-form .hs-form-private .hs-form-field{margin-bottom:14px!important;}',
    '#hs-ccr-form .hs-form-private .hs-error-msgs{color:#f87171!important;font-size:11px!important;list-style:none!important;}',
    '#hs-ccr-form .hs-form-private .hs-error-msgs li label{color:#f87171!important;}',
    '#hs-ccr-form .hs-form-private .legal-consent-container{font-size:11px!important;color:rgba(255,255,255,.25)!important;}',
    '#hs-ccr-form .hs-form-private .legal-consent-container a{color:rgba(255,255,255,.45)!important;}',
    /* submit button */
    '#hs-ccr-form .hs-form-private .hs-button{background:#E8634A!important;border:none!important;border-radius:3px!important;font-family:"IBM Plex Mono",monospace!important;font-size:11px!important;font-weight:500!important;letter-spacing:.08em!important;text-transform:uppercase!important;padding:13px 28px!important;color:#fff!important;width:100%!important;cursor:pointer!important;box-shadow:0 2px 8px rgba(232,99,74,.35)!important;}',
    '#hs-ccr-form .hs-form-private .hs-button:hover{background:#F0745C!important;}',
  ].join('');

  function createForm() {
    window.hbspt.forms.create({
      region: 'na1',
      portalId: PORTAL,
      formId: FORM,
      target: '#hs-ccr-form'
    });
  }

  function waitForHubSpot(cb) {
    if (window.hbspt) { cb(); return; }
    var elapsed = 0;
    var poll = setInterval(function () {
      elapsed += 100;
      if (window.hbspt) { clearInterval(poll); cb(); return; }
      if (elapsed >= 6000) {
        clearInterval(poll);
        /* HubSpot not loaded — inject it ourselves */
        var s = document.createElement('script');
        s.src = '//js.hsforms.net/forms/embed/v2.js';
        s.onload = cb;
        document.body.appendChild(s);
      }
    }, 100);
  }

  function injectCard() {
    var formSection = document.querySelector('#ccr-form .form-section');
    if (!formSection) return;

    /* Inject styles once */
    var style = document.createElement('style');
    style.id = 'rs-ccr-form-styles';
    if (!document.getElementById('rs-ccr-form-styles')) {
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    /* Build the contact-style card */
    var wrap = document.createElement('div');
    wrap.style.cssText = 'max-width:680px;margin:0 auto;';
    wrap.innerHTML =
      '<div class="ccr-card">' +
        '<span class="ccr-card-label">Free Report &middot; RevShoppe</span>' +
        '<div class="ccr-card-title">Get your Conversation Catalysts Report.</div>' +
        '<div class="ccr-card-sub">Tell us which vertical you sell into. We\'ll deliver the catalysts shaping buying cycles in your market — and walk you through how top teams act on them.</div>' +
        '<div id="hs-ccr-form"></div>' +
      '</div>';

    /* Swap out the old unstyled section */
    formSection.parentNode.replaceChild(wrap, formSection);

    /* Init HubSpot in the new container */
    waitForHubSpot(createForm);
  }

  /* Poll for the form section — it lives inside a Webflow HTML embed */
  var elapsed = 0;
  var sectionPoll = setInterval(function () {
    elapsed += 50;
    var target = document.querySelector('#ccr-form .form-section');
    if (target) {
      clearInterval(sectionPoll);
      injectCard();
    } else if (elapsed >= 8000) {
      clearInterval(sectionPoll);
    }
  }, 50);
})();
