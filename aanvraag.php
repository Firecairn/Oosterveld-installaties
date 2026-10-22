<?php
/**
 * aanvraag.php – ontvangt de offerte-aanvraag van de website van Oosterveld Installaties,
 * mailt hem naar de klant en stuurt hem (optioneel) door naar het offertesysteem.
 *
 * Plaatsen: naast index.html / in de root van oosterveldinstallaties.nl (of in WordPress als los PHP-bestand).
 * In de website: var CFG={endpoint:"/aanvraag.php"};
 *
 * Wat de website verstuurt (JSON, POST):
 * {
 *   "tekst":   "OFFERTE-AANVRAAG\nProject: Complete badkamer\n...",   // leesbare tekst, zelfde als in WhatsApp
 *   "velden":  { "Project":"Complete badkamer", "Klanttype":"Particulier", "Woning":"Nieuwbouw",
 *                "Afmetingen":"2 × 3 m (6 m²)", "Woonplaats":"Emmen", "Naam":"...", "Telefoon":"...", "E-mail":"..." },
 *   "website": "",                                                    // honeypot, moet leeg zijn
 *   "pagina":  "https://oosterveldinstallaties.nl/"
 * }
 *
 * Wat het offertesysteem (WEBHOOK_URL) ontvangt (JSON, POST, header X-Signature = HMAC-SHA256 van de body):
 * { "bron":"website", "ontvangen":"2026-10-19T20:30:00+02:00", "project":"Complete badkamer",
 *   "velden":{...zelfde als hierboven...}, "tekst":"..." }
 */
declare(strict_types=1);

// ====== INSTELLINGEN – controleren voor livegang ======
const TO_EMAIL      = 'info@oosterveldinstallaties.nl';   // waar de aanvragen binnenkomen (adres van de klant invullen)
const FROM_EMAIL    = 'no-reply@oosterveldinstallaties.nl'; // moet een adres op het eigen domein zijn (anders komt de mail vaak in spam)
const ALLOWED_ORIGINS = ['https://oosterveldinstallaties.nl', 'https://www.oosterveldinstallaties.nl'];
const WEBHOOK_URL   = '';   // bijv. 'https://offerte.oosterveldinstallaties.nl/api/aanvraag' (leeg = niet doorsturen)
const WEBHOOK_SECRET = '';  // gedeeld geheim met het offertesysteem, om de afzender te controleren
const MAX_PER_10_MIN = 5;   // maximaal aantal aanvragen per IP-adres per 10 minuten
// ======================================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

function out(int $code, array $body): void {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function clean($v, int $max = 3000): string {
    $v = is_string($v) ? $v : '';
    $v = preg_replace('/[^\P{C}\n]/u', '', $v) ?? '';   // geen stuurtekens, regeleinden mogen blijven
    return mb_substr(trim($v), 0, $max);
}

function one_line(string $v): string {
    return trim(preg_replace('/\s+/', ' ', $v) ?? '');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { out(405, ['ok' => false, 'fout' => 'Alleen POST']); }

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 20000) { out(413, ['ok' => false, 'fout' => 'Te groot']); }
$d = json_decode($raw, true);
if (!is_array($d)) { out(400, ['ok' => false, 'fout' => 'Ongeldige gegevens']); }

// Honeypot: bots vullen dit veld in. Doen alsof het gelukt is.
if (!empty($d['website'])) { out(200, ['ok' => true]); }

// Beperk het aantal aanvragen per IP
$ip = $_SERVER['REMOTE_ADDR'] ?? 'onbekend';
$rl = sys_get_temp_dir() . '/oosterveld_rl_' . md5($ip);
$now = time();
$hits = [];
if (is_file($rl)) {
    $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($rl))), fn($t) => $t > $now - 600);
}
if (count($hits) >= MAX_PER_10_MIN) { out(429, ['ok' => false, 'fout' => 'Te veel aanvragen, probeer het later opnieuw']); }
$hits[] = $now;
@file_put_contents($rl, implode(',', $hits), LOCK_EX);

// Velden
$velden = [];
if (isset($d['velden']) && is_array($d['velden'])) {
    foreach ($d['velden'] as $k => $v) {
        if (is_string($k) && is_string($v) && count($velden) < 60) {
            $velden[clean($k, 80)] = clean($v, 1000);
        }
    }
}
$tekst = clean($d['tekst'] ?? '', 6000);

foreach (['Project', 'Woonplaats', 'Naam', 'Telefoon'] as $verplicht) {
    if (empty($velden[$verplicht])) { out(422, ['ok' => false, 'fout' => "Ontbrekend veld: $verplicht"]); }
}
$replyTo = filter_var($velden['E-mail'] ?? '', FILTER_VALIDATE_EMAIL) ? $velden['E-mail'] : '';

// E-mail naar de klant
$onderwerp = one_line('Nieuwe offerte-aanvraag: ' . $velden['Project'] . ' – ' . $velden['Woonplaats'] . ' – ' . $velden['Naam']);
$body = $tekst !== '' ? $tekst : '';
$body .= "\n\n--\nOntvangen via oosterveldinstallaties.nl op " . date('d-m-Y H:i') . "\n";
$headers = [
    'From: Oosterveld Installaties website <' . FROM_EMAIL . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: aanvraag.php',
];
if ($replyTo !== '') { $headers[] = 'Reply-To: ' . $replyTo; }

$verzonden = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($onderwerp) . '?=', $body, implode("\r\n", $headers));

// Doorsturen naar het offertesysteem (mislukken hiervan mag de mail niet blokkeren)
$doorgestuurd = null;
if (WEBHOOK_URL !== '') {
    $payload = json_encode([
        'bron' => 'website',
        'ontvangen' => date('c'),
        'project' => $velden['Project'],
        'velden' => $velden,
        'tekst' => $tekst,
    ], JSON_UNESCAPED_UNICODE);
    $ch = curl_init(WEBHOOK_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 6,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Signature: ' . hash_hmac('sha256', $payload, WEBHOOK_SECRET),
        ],
    ]);
    curl_exec($ch);
    $doorgestuurd = curl_getinfo($ch, CURLINFO_RESPONSE_CODE) >= 200 && curl_getinfo($ch, CURLINFO_RESPONSE_CODE) < 300;
    curl_close($ch);
    if (!$doorgestuurd) { error_log('aanvraag.php: doorsturen naar offertesysteem mislukt'); }
}

if (!$verzonden && $doorgestuurd !== true) {
    error_log('aanvraag.php: mail() mislukt');
    out(500, ['ok' => false, 'fout' => 'Versturen mislukt']);
}
out(200, ['ok' => true]);
