// De bevestigingsmail aan de klant: een nette HTML-versie (tabellen en inline stijlen, zodat hij in elk mailprogramma goed oogt) plus een tekstversie.
const TELEFOON = '06 16 62 36 02', WEB = 'oosterveldinstallaties.nl', LOGO = 'https://oosterveldinstallaties.nl/mail-logo.png';
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const F = "Inter,'Helvetica Neue',Helvetica,Arial,sans-serif";

function regels(tekst) {
  return String(tekst || '').split('\n').map((r) => r.trim()).filter(Boolean).map((r) => {
    const i = r.indexOf(': ');
    return i > 0 && i < 40 ? { k: r.slice(0, i), v: r.slice(i + 2) } : { k: '', v: r };
  });
}

function bevestiging({ naam, tekst }) {
  const n = String(naam || '').replace(/\s+/g, ' ').trim();
  const rijen = regels(tekst);
  const stappen = [
    ['Wij bekijken uw aanvraag', 'Zo snel mogelijk nemen wij contact met u op.'],
    ['Richtprijs of afspraak', 'U ontvangt een richtprijs, of een voorstel om de situatie ter plaatse te bekijken.'],
    ['Definitieve offerte', 'Na de opname volgt de definitieve prijs. Pas na uw akkoord gaan wij aan de slag.'],
  ];
  const stap = (s, i) => `<tr><td width="40" valign="top" style="padding:0 0 18px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" valign="middle" style="width:28px;height:28px;border-radius:14px;background:#ED9121;color:#1F2328;font:700 13px/28px ${F}">${i + 1}</td></tr></table></td><td valign="top" style="padding:0 0 18px 0;font:400 15px/1.5 ${F};color:#5D5D58"><b style="color:#1F2328;font-weight:600">${s[0]}</b><br>${s[1]}</td></tr>`;
  const rij = (r) => r.k
    ? `<tr><td valign="top" width="38%" style="padding:9px 12px 9px 0;border-top:1px solid #EFEBE4;font:400 13px/1.45 ${F};color:#5D5D58">${esc(r.k)}</td><td valign="top" style="padding:9px 0;border-top:1px solid #EFEBE4;font:500 14px/1.45 ${F};color:#1F2328">${esc(r.v)}</td></tr>`
    : `<tr><td colspan="2" style="padding:9px 0;border-top:1px solid #EFEBE4;font:400 14px/1.5 ${F};color:#1F2328">${esc(r.v)}</td></tr>`;
  const html = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Wij hebben uw aanvraag ontvangen</title></head>
<body style="margin:0;padding:0;background:#F7F5F1">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Bedankt voor uw aanvraag. Wij nemen zo snel mogelijk contact met u op.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F1"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
<tr><td style="background:#1F2328;border-radius:16px 16px 0 0;padding:32px 36px 28px 36px"><img src="${LOGO}" width="240" alt="Oosterveld Installaties" style="display:block;width:240px;max-width:100%;height:auto;border:0"></td></tr>
<tr><td height="4" style="height:4px;line-height:4px;font-size:0;background:#ED9121">&nbsp;</td></tr>
<tr><td style="background:#FFFFFF;padding:36px 36px 8px 36px">
<div style="font:600 12px/1 ${F};letter-spacing:.2em;color:#9A5506;margin:0 0 14px 0">AANVRAAG ONTVANGEN</div>
<h1 style="margin:0 0 16px 0;font:700 28px/1.2 ${F};color:#1F2328;letter-spacing:-.01em">Bedankt voor uw aanvraag${n ? ', ' + esc(n) : ''}</h1>
<p style="margin:0 0 28px 0;font:400 16px/1.6 ${F};color:#3A3F45">Wij hebben uw aanvraag in goede orde ontvangen. Hieronder leest u hoe het nu verder gaat.</p>
<div style="font:600 12px/1 ${F};letter-spacing:.14em;color:#5D5D58;margin:0 0 16px 0">HOE HET VERDER GAAT</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stappen.map(stap).join('')}</table>
</td></tr>
<tr><td style="background:#FFFFFF;padding:8px 36px 8px 36px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F1;border-radius:12px"><tr><td style="padding:20px 22px">
<div style="font:600 12px/1 ${F};letter-spacing:.14em;color:#5D5D58;margin:0 0 10px 0">UW GEGEVENS</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rijen.map(rij).join('')}</table>
</td></tr></table>
</td></tr>
<tr><td style="background:#FFFFFF;padding:28px 36px 36px 36px">
<p style="margin:0 0 18px 0;font:400 15px/1.6 ${F};color:#3A3F45">Wilt u iets aanvullen of heeft u een vraag? Reageer gewoon op deze e-mail, of bel ons.</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" style="background:#1F2328;border-radius:10px"><a href="tel:+31616623602" style="display:inline-block;padding:14px 26px;font:600 15px/1 ${F};color:#FFFFFF;text-decoration:none">Bel ${TELEFOON}</a></td></tr></table>
</td></tr>
<tr><td style="background:#1F2328;border-radius:0 0 16px 16px;padding:22px 36px;font:400 13px/1.6 ${F};color:#AEB4BC">
<b style="color:#FFFFFF;font-weight:600">Oosterveld Installaties</b><br>Dingspellaan 19 · 7824 GB Emmen<br>${TELEFOON} · <a href="https://${WEB}" style="color:#ED9121;text-decoration:none">${WEB}</a>
</td></tr>
<tr><td style="padding:16px 12px 0 12px;font:400 12px/1.5 ${F};color:#8A8A85;text-align:center">U ontvangt deze e-mail omdat u een aanvraag heeft gedaan via ${WEB}.</td></tr>
</table></td></tr></table></body></html>`;
  const text = `Beste ${n || 'klant'},

Bedankt voor uw aanvraag via ${WEB}. Wij hebben uw aanvraag in goede orde ontvangen.

Hoe het verder gaat
1. Wij bekijken uw aanvraag en nemen zo snel mogelijk contact met u op.
2. U ontvangt een richtprijs, of een voorstel om de situatie ter plaatse te bekijken.
3. Na de opname volgt de definitieve prijs. Pas na uw akkoord gaan wij aan de slag.

Wilt u iets aanvullen of heeft u een vraag? Reageer gewoon op deze e-mail, of bel ons op ${TELEFOON}.

Dit hebt u aan ons doorgegeven:
--------------------------------
${String(tekst || '')}
--------------------------------

Met vriendelijke groet,
Oosterveld Installaties
Dingspellaan 19 · 7824 GB Emmen
${TELEFOON} · ${WEB}
`;
  return { html, text };
}
module.exports = { bevestiging };
