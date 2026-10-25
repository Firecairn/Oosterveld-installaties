// Vercel serverless function: ontvangt het offerteformulier, mailt het via Resend
// en stuurt het (optioneel) door naar het offertesysteem.
// Environment variables (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   (verplicht)  API-sleutel van resend.com
//   TO_EMAIL         (verplicht)  adres van de klant waar aanvragen binnenkomen
//   FROM_EMAIL       (verplicht)  afzender op een geverifieerd domein, bijv. website@oosterveldinstallaties.nl
//   WEBHOOK_URL      (optioneel)  endpoint van het offertesysteem
//   WEBHOOK_SECRET   (optioneel)  gedeeld geheim, HMAC-SHA256 in header X-Signature
const crypto = require('crypto');
const { bevestiging } = require('./_bevestiging');
const hits = new Map(); // eenvoudige rate limit per instantie
const clean = (v, max = 3000) => (typeof v === 'string' ? v.replace(/[^\P{C}\n]/gu, '').trim().slice(0, max) : '');

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (/^https:\/\/(www\.)?oosterveldinstallaties\.nl$/.test(origin) || /^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, fout: 'Alleen POST' });

  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = null; } }
  if (!d || typeof d !== 'object') return res.status(400).json({ ok: false, fout: 'Ongeldige gegevens' });
  if (d.website) return res.status(200).json({ ok: true }); // honeypot

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'onbekend';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => t > now - 600000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, fout: 'Te veel aanvragen, probeer het later opnieuw' });
  recent.push(now); hits.set(ip, recent);

  const velden = {};
  if (d.velden && typeof d.velden === 'object') {
    for (const [k, v] of Object.entries(d.velden)) {
      if (typeof v === 'string' && Object.keys(velden).length < 60) velden[clean(k, 80)] = clean(v, 1000);
    }
  }
  for (const k of ['Project', 'Woonplaats', 'Naam', 'Telefoon', 'E-mail']) {
    if (!velden[k]) return res.status(422).json({ ok: false, fout: 'Ontbrekend veld: ' + k });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(velden['E-mail'])) return res.status(422).json({ ok: false, fout: 'Ongeldig e-mailadres' });
  const tekst = clean(d.tekst, 6000);
  const email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(velden['E-mail'] || '') ? velden['E-mail'] : undefined;
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
        text: `${tekst}\n\n--\nOntvangen via oosterveldinstallaties.nl op ${tijd}\n`,
      }),
    });
    verzonden = r.ok;
    if (!r.ok) console.error('Resend fout', r.status, await r.text());
  } catch (e) { console.error('Resend fout', e); }

  let doorgestuurd = null;
  if (process.env.WEBHOOK_URL) {
    const payload = JSON.stringify({ bron: 'website', ontvangen: new Date().toISOString(), project: velden.Project, velden, tekst });
    try {
      const r = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST', signal: AbortSignal.timeout(6000),
        headers: { 'Content-Type': 'application/json', 'X-Signature': crypto.createHmac('sha256', process.env.WEBHOOK_SECRET || '').update(payload).digest('hex') },
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
        from: 'Oosterveld Installaties <' + process.env.FROM_EMAIL + '>',
        to: [email], reply_to: process.env.TO_EMAIL, subject: 'Wij hebben uw aanvraag ontvangen', html, text,
      }),
    });
    if (!r.ok) console.error('Bevestigingsmail mislukt', r.status, await r.text());
  } catch (e) { console.error('Bevestigingsmail mislukt', e); }
  return res.status(200).json({ ok: true });
};
