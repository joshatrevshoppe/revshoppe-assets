(function(){
  var H='https://raw.githubusercontent.com/joshatrevshoppe/revshoppe-assets/refs/heads/main/';
  fetch(H+'gtm-infrastructure-page.html').then(function(r){return r.text();}).then(function(html){
    var t=document.createElement('div');t.innerHTML=html;
    var sc=Array.from(t.querySelectorAll('script'));
    sc.forEach(function(s){s.parentNode.removeChild(s);});
    while(t.firstChild){document.body.appendChild(t.firstChild);}
    sc.forEach(function(o){var s=document.createElement('script');if(o.src){s.src=o.src;}else{s.textContent=o.textContent;}document.body.appendChild(s);});
    return fetch(H+'revshoppe-body-v10.html');
  }).then(function(r){return r.text();}).then(function(html){
    var t=document.createElement('div');t.innerHTML=html;
    var nav=t.querySelector('nav');
    var mob=t.querySelector('#nav-mobile');
    var ft=t.querySelector('footer');
    if(nav)document.body.insertBefore(nav,document.body.firstChild);
    if(mob&&nav)nav.parentNode.insertBefore(mob,nav.nextSibling);
    if(ft)document.body.appendChild(ft);
    var s=document.createElement('script');s.src=H+'revshoppe-scripts.js';document.body.appendChild(s);
  }).catch(function(e){console.error('[rs_gtm_infrastructure]',e);});
})();
