// Vercel serverless function: haalt de Google-reviews van het bedrijf op via de Places API (New)
// en geeft ze als JSON terug aan de website. Het resultaat wordt 6 uur door Vercel gecachet,
// zodat het aantal API-aanroepen (en de kosten) minimaal blijft.
// Environment variables (Vercel → Settings → Environment Variables):
//   GOOGLE_PLACES_API_KEY  (verplicht)  API-sleutel met alleen "Places API (New)" ingeschakeld
//   GOOGLE_PLACE_ID        (aanbevolen) Place ID van het Google Bedrijfsprofiel (begint met ChIJ...)
//                                        Zonder Place ID zoekt de functie het bedrijf zelf op.
const CID = '8193778902041046188';
const FIELDS = 'id,displayName,googleMapsUri,rating,userRatingCount,reviews';
let cachedId = null;

async function g(url, opts = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 6000);
  try { return await fetch(url, { ...opts, signal: ctl.signal }); } finally { clearTimeout(t); }
}

async function findPlaceId(key) {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (cachedId) return cachedId;
  const r = await g('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.googleMapsUri' },
    body: JSON.stringify({ textQuery: 'Oosterveld Installaties Emmen', languageCode: 'nl', regionCode: 'NL' }),
  });
  if (!r.ok) throw new Error('zoeken mislukt ' + r.status);
  const j = await r.json();
  const lijst = j.places || [];
  const hit = lijst.find(p => (p.googleMapsUri || '').includes(CID)) || lijst.find(p => /oosterveld/i.test((p.displayName || {}).text || ''));
  if (!hit) throw new Error('bedrijf niet gevonden');
  return (cachedId = hit.id);
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) { res.setHeader('Cache-Control', 'public, s-maxage=300'); return res.status(200).json({ ok: false, fout: 'Niet ingesteld' }); }
  try {
    const id = await findPlaceId(key);
    const r = await g('https://places.googleapis.com/v1/places/' + encodeURIComponent(id) + '?languageCode=nl&regionCode=NL', {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
    });
    if (!r.ok) throw new Error('details mislukt ' + r.status);
    const p = await r.json();
    const reviews = (p.reviews || []).map(v => ({
      naam: (v.authorAttribution && v.authorAttribution.displayName) || 'Google-gebruiker',
      url: (v.authorAttribution && v.authorAttribution.uri) || '',
      sterren: v.rating || 5,
      tekst: ((v.originalText && v.originalText.text) || (v.text && v.text.text) || '').trim(),
      datum: v.publishTime || '',
    })).filter(v => v.tekst).sort((a, b) => (b.datum || '').localeCompare(a.datum || ''));
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({ ok: true, rating: p.rating || null, aantal: p.userRatingCount || null, kaart: p.googleMapsUri || '', reviews });
  } catch (e) {
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).json({ ok: false, fout: 'Reviews tijdelijk niet beschikbaar' });
  }
};
