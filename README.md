# Oosterveld Installaties

Website van oosterveldinstallaties.nl (statische HTML/CSS/JS).

- `aanvraag.php`: ontvangt het offerteformulier en mailt het naar de klant; optioneel doorsturen naar het offertesysteem. Vul bovenin TO_EMAIL, FROM_EMAIL, WEBHOOK_URL en WEBHOOK_SECRET in.
- In `form.js`: zet `CFG.endpoint` op `/aanvraag.php`.
