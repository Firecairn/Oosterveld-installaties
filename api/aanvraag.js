// Vercel serverless function: ontvangt het offerteformulier, mailt het via Resend
// en stuurt het (optioneel) door naar het offertesysteem.
// Environment variables (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   (verplicht)  API-sleutel van resend.com
//   TO_EMAIL         (verplicht)  adres van de klant waar aanvragen binnenkomen
//   FROM_EMAIL       (verplicht)  afzender op een geverifieerd domein, bijv. website@oosterveldinstallaties.nl
//   WEBHOOK_URL      (optioneel)  endpoint van het offertesysteem
//   WEBHOOK_SECRET   (optioneel)  gedeeld geheim, HMAC-SHA256 in header X-Signature
//   ANTHROPIC_API_KEY (optioneel) laat de AI meegestuurde foto's uitlezen; zonder sleutel worden ze alleen gemaild
const crypto = require('crypto');
const { bevestiging } = require('./_bevestiging');
const { leesFotos, analyseer } = require('./_fotos');
const hits = new Map(); // eenvoudige rate limit per instantie
const MAIL = /^[A-Za-z0-9._%+'-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,24}$/; // strikt: geen komma's, spaties of haakjes
const clean = (v, max = 3000) => (typeof v === 'string' ? v.replace(/[^\P{C}\n]/gu, '').trim().slice(0, max) : '');

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (/^https:\/\/(www\.)?oosterveldinstallaties\.nl$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, fout: 'Alleen POST' });
  // Alleen de eigen site mag het formulier versturen.
  if (!/^https:\/\/(www\.)?oosterveldinstallaties\.nl$/.test(origin)) return res.status(403).json({ ok: false, fout: 'Geen toegang' });

  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = null; } }
  if (!d || typeof d !== 'object') return res.status(400).json({ ok: false, fout: 'Ongeldige gegevens' });
  if (d.website) return res.status(200).json({ ok: true }); // honeypot

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'onbekend';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => t > now - 600000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, fout: 'Te veel aanvragen, probeer het later opnieuw' });
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();

  const velden = {};
  if (d.velden && typeof d.velden === 'object') {
    for (const [k, v] of Object.entries(d.velden)) {
      if (typeof v === 'string' && Object.keys(velden).length < 60) velden[clean(k, 80)] = clean(v, 1000);
    }
  }
  for (const k of ['Project', 'Woonplaats', 'Naam', 'Telefoon', 'E-mail']) {
    if (!velden[k]) return res.status(422).json({ ok: false, fout: 'Ontbrekend veld: ' + k });
  }
  if (velden['E-mail'].length > 254 || !MAIL.test(velden['E-mail'])) return res.status(422).json({ ok: false, fout: 'Ongeldig e-mailadres' });
  const tekst = clean(d.tekst, 6000);
  const fotos = leesFotos(d.fotos);
  let analyse = null;
  if (fotos.length) { try { analyse = await analyseer(fotos, velden); } catch (e) { console.error('Foto-analyse mislukt', e.message); } }
  const fotoTekst = fotos.length ? `\n\nFOTO'S: ${fotos.length} beeld(en) meegestuurd${fotos.some((f) => f.bron === 'video') ? ' (deels uit een video)' : ''}, zie de bijlagen in de mail.${analyse ? '\n\n' + analyse : ''}` : '';
  const email = velden['E-mail'];
  const onderwerp = `Nieuwe offerte-aanvraag: ${velden.Project} – ${velden.Woonplaats} – ${velden.Naam}`.replace(/\s+/g, ' ');
  const tijd = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });

  let verzonden = false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Oosterveld website <' + process.env.FROM_EMAIL + '>',
        to: [process.env.TO_EMAIL], reply_to: email, subject: onderwerp,
        text: `${tekst}${fotoTekst}\n\n--\nOntvangen via oosterveldinstallaties.nl op ${tijd}\n`,
        ...(fotos.length ? { attachments: fotos.map((f, i) => ({ filename: `${f.bron}-${i + 1}.jpg`, content: f.buf.toString('base64') })) } : {}),
      }),
    });
    verzonden = r.ok;
    if (!r.ok) console.error('Resend fout', r.status, await r.text());
  } catch (e) { console.error('Resend fout', e); }

  let doorgestuurd = null;
  if (process.env.WEBHOOK_URL && process.env.WEBHOOK_SECRET) {
    // Herkomst (pagina, verwijzer, campagne): alleen korte, bekende velden.
    const h = d.herkomst && typeof d.herkomst === 'object' ? d.herkomst : {}, herkomst = {};
    for (const [k, max] of [['pagina', 200], ['verwijzer', 200], ['utm_source', 80], ['utm_medium', 80], ['utm_campaign', 80], ['gclid', 4]]) if (typeof h[k] === 'string' && h[k]) herkomst[k] = clean(h[k], max);
    const systeemTekst = fotoTekst ? (tekst.slice(0, 6000 - fotoTekst.length) + fotoTekst).slice(0, 6000) : tekst;
    const payload = JSON.stringify({ bron: 'website', ontvangen: new Date().toISOString(), project: velden.Project, velden, tekst: systeemTekst, herkomst });
    try {
      const r = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST', signal: AbortSignal.timeout(6000),
        headers: { 'Content-Type': 'application/json', 'X-Signature': crypto.createHmac('sha256', process.env.WEBHOOK_SECRET).update(payload).digest('hex') },
        body: payload,
      });
      doorgestuurd = r.ok;
    } catch { doorgestuurd = false; }
    if (!doorgestuurd) console.error('Doorsturen naar offertesysteem mislukt');
  }
  if (!verzonden && doorgestuurd !== true) return res.status(500).json({ ok: false, fout: 'Versturen mislukt' });

  // Bevestiging aan de klant. Mislukt dit, dan blijft de aanvraag gewoon geldig.
  try {
    const { html, text } = bevestiging({ naam: velden.Naam, tekst });
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Oosterveld <' + process.env.FROM_EMAIL + '>',
        to: [email], reply_to: process.env.TO_EMAIL, subject: 'Wij hebben uw aanvraag ontvangen', html, text,
      }),
    });
    if (!r.ok) console.error('Bevestigingsmail mislukt', r.status, await r.text());
  } catch (e) { console.error('Bevestigingsmail mislukt', e); }
  return res.status(200).json({ ok: true });
};
