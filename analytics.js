/* Google Analytics, alleen na toestemming. Zonder "Accepteren" wordt er niets van Google geladen en geen cookie gezet.
   Keuze wijzigen kan altijd via "Cookie-instellingen" onderaan de pagina. Zolang ID leeg is, gebeurt er niets. */
(function () {
  var ID = ''; // Metings-ID van Oosterveld, bijv. 'G-XXXXXXXXXX'
  var SLEUTEL = 'oo-cookies', geladen = false, banner;
  if (!/^G-[A-Z0-9]{4,20}$/.test(ID)) { window.ooEvent = function () {}; return; }
  document.querySelectorAll('[data-cookie-instellingen]').forEach(function (b) { b.hidden = false; });
  function lees() { try { return localStorage.getItem(SLEUTEL); } catch (e) { return null; } }
  function bewaar(v) { try { localStorage.setItem(SLEUTEL, v); } catch (e) { /* vraag het de volgende keer opnieuw */ } }
  function laad() {
    if (geladen) return; geladen = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
  }
  function wis() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim(); if (!/^_ga/.test(n)) return;
      var host = location.hostname.replace(/^www\./, '');
      ['', '.' + host, host, location.hostname].forEach(function (d) { document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : ''); });
    });
  }
  window.ooEvent = function (naam, gegevens) { if (geladen && window.gtag) window.gtag('event', naam, gegevens || {}); };
  function toon() {
    if (banner) { banner.hidden = false; banner.querySelector('button').focus(); return; }
    banner = document.createElement('div');
    banner.className = 'cookies'; banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-labelledby', 'ck-kop'); banner.setAttribute('aria-describedby', 'ck-tekst');
    banner.innerHTML = '<p id="ck-kop" class="ck-kop">Mogen we meten hoe je de site gebruikt?</p>' +
      '<p id="ck-tekst">Met Google Analytics zien we welke pagina’s bezocht worden en hoe mensen ons vinden. Zo maken we de site beter. We zien niet wie je bent en gebruiken het niet voor reclame. Lees meer in de <a href="privacy.html">privacyverklaring</a>.</p>' +
      '<div class="ck-knoppen"><button type="button" class="btn" data-keuze="ja">Accepteren</button><button type="button" class="btn ghost" data-keuze="nee">Weigeren</button></div>';
    banner.addEventListener('click', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-keuze'); if (!k) return;
      bewaar(k); banner.hidden = true;
      if (k === 'ja') laad(); else { wis(); if (geladen) location.reload(); }
    });
    document.body.appendChild(banner);
  }
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-cookie-instellingen]'); if (t) { e.preventDefault(); toon(); } });
  var keuze = lees();
  if (keuze === 'ja') laad();
  else if (keuze !== 'nee') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', toon); else toon(); }
})();
