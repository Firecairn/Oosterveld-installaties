# Oosterveld Installaties

Website van oosterveldinstallaties.nl (statische HTML/CSS/JS).

- `api/aanvraag.js`: Vercel-functie die het offerteformulier per e-mail (Resend) verstuurt en optioneel doorstuurt naar het offertesysteem. Zie de variabelen bovenin het bestand.
- `api/aanvraag.js`: Vercel-functie die het offerteformulier per e-mail (Resend) verstuurt en optioneel doorstuurt naar het offertesysteem. Zie de variabelen bovenin het bestand.

## Google-reviews automatisch bijwerken

De site toont naast de vaste reviews ook de nieuwste Google-reviews, opgehaald via `api/reviews.js`
(Places API (New)). Het resultaat wordt 6 uur gecachet. Werkt de koppeling niet, dan blijven de vaste reviews staan.

1. Ga naar https://console.cloud.google.com, maak (of kies) een project en koppel een factureringsaccount.
2. Zet **Places API (New)** aan (Bibliotheek → "Places API (New)").
3. Maak een API-sleutel (Credentials → Create credentials → API key) en beperk hem onder "API restrictions" tot alleen **Places API (New)**.
4. Zet een budgetmelding (Billing → Budgets & alerts), bijvoorbeeld op 5 euro.
5. Vercel → Settings → Environment Variables:
   - `GOOGLE_PLACES_API_KEY` = de sleutel
   - `GOOGLE_PLACE_ID` = (aanbevolen) het Place ID van het bedrijfsprofiel, te vinden via de Place ID Finder van Google.
     Zonder deze variabele zoekt de functie het bedrijf zelf op.
6. Redeploy. Test met `https://oosterveldinstallaties.nl/api/reviews`; je ziet `"ok":true` en de reviews.

Let op: de Places API geeft per keer maximaal 5 reviews terug (de meest relevante), niet de volledige lijst.
Nieuwe reviews worden dus automatisch bovenaan toegevoegd zolang ze in die 5 zitten; reviews die al op de site staan blijven staan.
