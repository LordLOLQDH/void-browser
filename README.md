# VOID — dein privater Browser

Ein eigenständiger, im Browser laufender "Meta-Browser" mit Tabs, Adressleiste,
Verlauf und einem Live-Privacy-Monitor. Läuft komplett statisch auf GitHub Pages —
keine eigene Server-Komponente, keine Server-Logs, keine Kosten.

## Wichtig zu verstehen

GitHub Pages liefert nur statische Dateien aus. Ein "echter" Browser wie Chrome
(mit eigener Rendering-Engine, TCP/TLS-Stack etc.) lässt sich damit nicht bauen.
VOID löst das so: Seiten werden über einen **kostenlosen CORS-Proxy** in ein
sandboxed `<iframe>` geladen. Alle Browser-Funktionen (Tabs, Verlauf, Lesezeichen,
Einstellungen) laufen zu 100 % im Browser des Nutzers — nichts wird an einen
eigenen Server geschickt, weil es keinen gibt.

## Sofort deployen (3 Minuten)

1. Erstelle ein neues GitHub-Repository, z. B. `void-browser`.
2. Lade `index.html`, `style.css` und `app.js` in den Root des Repos hoch
   (per Web-Upload oder `git push`).
3. Gehe zu **Settings → Pages** im Repo.
4. Unter "Build and deployment" → Source: **Deploy from a branch**,
   Branch: `main`, Ordner: `/ (root)`. Speichern.
5. Nach ca. 1 Minute ist die Seite live unter:
   `https://DEIN-USERNAME.github.io/void-browser/`

Fertig. Keine weiteren Schritte, keine API-Keys nötig — die verwendeten Proxies
(`allorigins.win`, `corsproxy.io`) sind kostenlos und schlüssellos nutzbar.

## Features

- **Tabs** mit eigenem Verlauf (vor/zurück) pro Tab
- **Adressleiste** erkennt automatisch URL vs. Suchanfrage
- **Startpage** mit anpassbaren Schnellzugriffen
- **Privacy-Monitor** (Seitenleiste): zeigt Schutzstatus, geblockte
  Tracker/Cookies (simuliert, da echtes Netzwerk-Blocking im Browser-Sandbox
  nicht einsehbar ist), aktive Schutzmaßnahmen, Live-Request-Log
- **Panic-Button**: löscht sofort alle lokalen Daten (Verlauf, Lesezeichen,
  Einstellungen, Verschlüsselungsschlüssel) und lädt neu
- **Verlauf & Lesezeichen** ausschließlich lokal, mit AES-256-GCM verschlüsselt
  im `localStorage` abgelegt (Schlüssel verlässt nie das Gerät)
- **Referrer-Stripping** (`referrerpolicy="no-referrer"` auf jedem Frame)
- **Sandboxing** jedes Tabs (`sandbox`-Attribut auf dem iframe)
- **3 Design-Themes**: Void (Schwarz/Grün), Ember (Dunkelrot), Frost (Blau)
- **Tastenkürzel**: `Strg/Cmd+T` neuer Tab, `Strg/Cmd+W` Tab schließen,
  `Strg/Cmd+L` Adressleiste fokussieren

## Grenzen (ehrlich gesagt)

- Manche Seiten lassen sich per CORS-Proxy nicht laden (z. B. wegen strikter
  `X-Frame-Options` oder CSP-Header, die auch der Proxy nicht umgehen kann,
  oder wenn der kostenlose Proxy selbst rate-limitet ist). VOID zeigt dann
  eine Fehlerseite mit "Anderen Proxy versuchen".
- Die "geblockten Tracker/Cookies"-Zahlen im Privacy-Panel sind eine
  **Visualisierung des Schutzkonzepts**, kein forensisches Netzwerk-Monitoring —
  echtes Deep-Packet-Tracking ist im Browser-Sandbox-Modell technisch nicht
  einsehbar. Die tatsächlichen Schutzmaßnahmen (kein Server-Log, lokale
  Verschlüsselung, Referrer-Stripping, Sandboxing) sind real und aktiv.
- Logins auf manchen Seiten (Google, etc.) funktionieren über Proxies oft
  nicht zuverlässig, da diese Dienste Proxy-Traffic aktiv erkennen und blocken.

## Eigenen Proxy nutzen (empfohlen für mehr Zuverlässigkeit)

Für bessere Ergebnisse solltest du kostenlos einen eigenen Proxy über
**Cloudflare Workers** (100.000 Requests/Tag im Free-Tier) betreiben.
Die fertige Datei `worker.js` liegt bei — Deploy in 2 Minuten:

1. https://dash.cloudflare.com → Workers & Pages → Create → Worker
2. Kompletten Inhalt von `worker.js` in den Editor einfügen → Deploy
3. Die zugewiesene URL (z. B. `https://void-proxy.dein-name.workers.dev`)
   in VOID unter Einstellungen → Proxy-Endpunkt → "Eigener Proxy" eintragen als:
   `https://void-proxy.dein-name.workers.dev/?url=%URL%`

Kein API-Key nötig, keine Kreditkarte, keine Kosten im Free-Tier.

## KI-Seitenzusammenfassung (Groq, kostenlos)

Der ✦-Button in der Adressleiste fasst die aktuell geladene Seite in 3–5 Sätzen
zusammen.

1. Kostenlosen Key holen: https://console.groq.com (kein Zahlungsmittel nötig)
2. In VOID unter Einstellungen → "Groq API-Key" einfügen
3. ✦ klicken, während eine Seite geladen ist

Der Key wird ausschließlich lokal (verschlüsselt) gespeichert und nur direkt
von deinem Browser aus an Groq geschickt — VOID selbst hat keinen Server, der
ihn sehen könnte. Hinweis: Kann die Seite den Inhalt aus dem Sandbox-iframe
nicht auslesen (Cross-Origin-Schutz greift bei manchen Proxies), gibt die KI
stattdessen eine Einschätzung nur anhand der URL.

## Dateien

- `index.html` — Struktur
- `style.css` — komplettes Terminal/Cyberpunk-Design, 3 Themes
- `app.js` — gesamte Logik (Tabs, Navigation, Storage, Privacy-Panel, KI-Zusammenfassung)
- `worker.js` — fertiger Cloudflare-Worker-Proxy zum Deployen (optional, empfohlen)
