<div align="center">

<img src="android-chrome-192x192.png" alt="VOID Browser Logo" width="128">

# VOID Browser

### Eine datenschutzorientierte Browser-Oberfläche für das Web.

**Schnell · Dunkel · Privat · Local-first**

[![GitHub](https://img.shields.io/badge/GitHub-LordLOLQDH-181717?logo=github)](https://github.com/LordLOLQDH/void-browser)
[![GitHub Stars](https://img.shields.io/github/stars/LordLOLQDH/void-browser?style=flat&logo=github)](https://github.com/LordLOLQDH/void-browser/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/LordLOLQDH/void-browser?style=flat&logo=github)](https://github.com/LordLOLQDH/void-browser/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/LordLOLQDH/void-browser?style=flat&logo=github)](https://github.com/LordLOLQDH/void-browser/issues)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222222?logo=github)](https://lordlolqdh.github.io/void-browser/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=111)](#)
[![Status](https://img.shields.io/badge/status-active%20development-00C853)](#)

<br>

**[VOID Browser öffnen](https://lordlolqdh.github.io/void-browser/)** · **[Quellcode ansehen](https://github.com/LordLOLQDH/void-browser)**

</div>

---

## Was ist VOID?

**VOID Browser** ist eine browserähnliche Webanwendung, die vollständig als statische Website ausgeführt werden kann. Sie bietet eine vertraute Oberfläche mit Tabs, Navigation, Suche, Lesezeichen, Verlauf, Themes und einem datenschutzorientierten Kontrollbereich – ohne ein eigenes VOID-Backend zu benötigen.

> **Wichtig:** VOID ist eine Webanwendung und kein Ersatz für Chrome, Safari, Firefox oder einen anderen nativen Browser. Eine Website kann keine eigene vollständige Rendering-Engine, keinen eigenen TCP/TLS-Stack und keine uneingeschränkte Netzwerküberwachung bereitstellen. VOID arbeitet innerhalb der normalen Sicherheitsgrenzen des Browsers und verwendet bei Bedarf Proxy-basiertes Laden von Webseiten.

---

## ✦ Funktionen

| Funktion | Beschreibung |
|---|---|
| 🗂️ **Browsing mit mehreren Tabs** | Tabs öffnen, wechseln, neu laden und schließen – jeweils mit eigenständigem Navigationsstatus. |
| ◀️ **Zurück / Vorwärts** | Durch den Verlauf des jeweiligen Tabs navigieren. |
| 🔎 **Intelligente Adressleiste** | URLs werden direkt geöffnet; andere Eingaben werden als Suchanfrage behandelt. |
| 🏠 **Individuelle Startseite** | Schnellzugriff-Kacheln und ein übersichtliches VOID-Dashboard. |
| 🔖 **Lesezeichen** | Häufig besuchte Seiten lokal speichern. |
| 🕘 **Verlauf** | Browserverlauf auf dem Gerät speichern. |
| 🛡️ **Datenschutz Monitor** | Datenschutzorientiertes Statuspanel mit Schutzinformationen und Anfrageaktivität. |
| ⚡ **Panic Button** | Lokal gespeicherte VOID-Daten schnell löschen und die Anwendung neu laden. |
| 🔐 **Lokale Verschlüsselung** | Sensible lokale Daten werden, sofern von der Anwendung unterstützt, mit AES-256-GCM geschützt. |
| 🧩 **Sandboxed Tabs** | Seiten werden in Sandbox-Iframes mit restriktiven Browser-Richtlinien geladen. |
| 🚫 **Referrer-Schutz** | Frames verwenden `no-referrer`, um die Weitergabe von Referrer-Informationen zu reduzieren. |
| 🎨 **3 Themes** | Void, Ember und Frost. |
| ✦ **KI-Zusammenfassungen** | Optionale, von Groq unterstützte Seitenzusammenfassungen. |
| 📱 **PWA-fähige Icons** | Favicons, Apple-Touch-Icon und Android-Chrome-Icons sind enthalten. |
| 💻 **Tastenkürzel** | Tastenkürzel für Tabs, das Schließen von Tabs und das Fokussieren der Adressleiste. |

---

## 🛡️ Datenschutz & Sicherheit

VOID basiert auf einer **Local-first**-Architektur.

### Was lokal bleibt

- Browsereinstellungen
- Bookmarks
- History
- Lokale Einstellungen
- Von der Anwendung verwendete Verschlüsselungsdaten
- Groq-API-Schlüssel, sofern eingerichtet

VOID selbst betreibt keinen zentralen Server und keine zentrale Datenbank für deinen Browserverlauf.

### Schutzfunktionen

- **Sandboxed iframes** for loaded pages
- **No-referrer policy** on browsing frames
- Local storage for user data
- AES-256-GCM encryption for supported sensitive local data
- Panic Button zum Löschen lokaler Anwendungsdaten

### Privacy Monitor – wichtige Einschränkung

Der Privacy Monitor ist teilweise eine **visuelle Darstellung des Schutzkonzepts**.

Eine normale Webseite kann nicht den gesamten Netzwerkverkehr wie eine native Browser-Erweiterung oder Browser-Engine untersuchen. Daher sollten von VOID angezeigte Tracker-/Cookie-Zähler **nicht** als forensische Netzwerk- oder Blockierungsstatistiken verstanden werden.

Die oben genannten architektonischen Schutzmaßnahmen sind real; simulierte bzw. visualisierte Zähler dienen bewusst als UI-Information und nicht als Nachweis einer vollständigen Netzwerkblockierung.

---

## 🌐 So funktioniert das Laden von Webseiten

GitHub Pages can only serve static files. VOID therefore cannot behave like a complete browser engine.

When a target website permits it, VOID can load it through an external CORS-compatible proxy:

`allorigins.win`  
`corsproxy.io`

Einige Webseiten können trotzdem das Laden verweigern, beispielsweise wegen:

- `X-Frame-Options`
- Content Security Policy
- Anti-bot systems
- Authentication restrictions
- Proxy rate limits
- Cross-origin browser security
- Websites that deliberately reject proxy traffic

Das ist eine technische Einschränkung einer Browser-Oberfläche als Webanwendung – kein Fehler, der sich immer mit Frontend-JavaScript beheben lässt.

---

## ☁️ Optional: Eigenen Cloudflare-Worker-Proxy verwenden

Für mehr Kontrolle und Zuverlässigkeit enthält VOID `worker.js`, das als Cloudflare Worker bereitgestellt werden kann.

### Einrichtung

1. Cloudflare-Dashboard öffnen.
2. Zu **Workers & Pages** wechseln.
3. Einen Worker erstellen.
4. Den Inhalt von `worker.js` einfügen.
5. Den Worker bereitstellen.
6. Die Worker-URL kopieren.
7. Open **VOID → Settings → Proxy Endpoint**.
8. **Custom Proxy** auswählen.
9. Den Endpoint im folgenden Format eintragen:

```text
https://YOUR-WORKER.workers.dev/?url=%URL%
```

Verfügbarkeit und Limits von Drittanbietern sowie Cloudflare-Tarife können sich ändern. Vor der Bereitstellung sollte daher die aktuelle Dokumentation geprüft werden.

---

## ✦ Optional: KI-Seitenzusammenfassungen mit Groq

VOID kann optional kurze Seitenzusammenfassungen über die Groq-API erzeugen.

### Setup

1. Groq-API-Schlüssel erstellen.
2. **VOID → Settings** öffnen.
3. Den Schlüssel unter **Groq API Key** eintragen.
4. Eine Seite laden.
5. Den **✦**-Button drücken.

Der Schlüssel wird von VOID lokal gespeichert und bei Verwendung der Funktion direkt vom Browser an Groq gesendet.

> Cross-origin restrictions may prevent VOID from reading the actual content inside some sandboxed pages. In those cases, the AI feature may only be able to work with limited information such as the URL.

---

## 🎨 Themes

VOID enthält derzeit drei visuelle Themes:

### VOID
Dunkle Schwarz-/Grün-Cyber-Oberfläche.

### EMBER
Dunkle Oberfläche mit Rot-/Orange-Akzenten.

### FROST
Dunkle Oberfläche mit Blau-/Cyan-Akzenten.

Die Themes sind in `style.css` implementiert und können in den Anwendungseinstellungen geändert werden.

---

## ⌨️ Tastenkürzel

| Tastenkürzel | Aktion |
|---|---|
| `Ctrl/Cmd + T` | Neuer Tab |
| `Ctrl/Cmd + W` | Aktuellen Tab schließen |
| `Ctrl/Cmd + L` | Adressleiste fokussieren |

Touch- und Mausbedienung werden von der Weboberfläche unterstützt.

---

## 📱 Icons & Branding

VOID enthält eine vollständige Favicon-/App-Icon-Konfiguration:

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

Dasselbe VOID-Logo wird in der README, im Browser-Branding und in der Anwendungsoberfläche verwendet.

---

## 🚀 VOID lokal ausführen

Es ist kein Build-System erforderlich.

### Option 1 – Direkt öffnen

Repository herunterladen oder klonen und `index.html` in einem modernen Browser öffnen.

### Option 2 – Lokaler Webserver

Für zuverlässigeres Verhalten sollte das Projekt über einen lokalen HTTP-Server bereitgestellt werden.

Example:

```bash
git clone https://github.com/LordLOLQDH/void-browser.git
cd void-browser
python3 -m http.server 8000
```

Danach öffnen:

`http://localhost:8000`

---

## 🌍 Mit GitHub Pages bereitstellen

1. Repository-**Settings** öffnen.
2. **Pages** auswählen.
3. Unter **Build and deployment** die Option **Deploy from a branch** auswählen.
4. Den Branch `main` auswählen.
5. `/(root)` auswählen.
6. Speichern.
7. Warten, bis GitHub Pages die Website veröffentlicht.

Live version:

**https://lordlolqdh.github.io/void-browser/**

---

## 📁 Projektstruktur

```text
void-browser/
├── index.html                  # Hauptanwendung und UI
├── style.css                   # UI, Layout, Themes und Animationen
├── app.js                      # Tabs, Navigation, Speicherung und Anwendungslogik
├── worker.js                   # Optionaler Cloudflare-Worker-Proxy
├── favicon.ico                 # Haupt-Favicon
├── favicon-16x16.png           # Kleines Favicon
├── favicon-32x32.png           # Standard-Favicon
├── apple-touch-icon.png        # Apple-Geräte-Icon
├── android-chrome-192x192.png  # Android-/PWA-Icon
├── android-chrome-512x512.png  # Großes Android-/PWA-Icon
├── site.webmanifest             # Web-App-Metadaten
└── README.md                   # Projektdokumentation
```

---

## 🧠 Architektur

```text
                    ┌──────────────────────┐
                    │     VOID Browser     │
                    │      index.html      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌─────────────┐
        │   Tabs    │    │  Privacy   │   │ Lokale Daten  │
        │ Navigation│    │   Monitor  │   │  & Storage  │
        └─────┬─────┘    └────────────┘   └─────────────┘
              │
              ▼
       ┌─────────────────┐
       │ Sandboxed iframe│
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Optionaler CORS   │
       │      Proxy      │
       └────────┬────────┘
                │
                ▼
          Ziel-Website
```

Frontend, Oberfläche und lokale Anwendungslogik von VOID laufen im Browser des Nutzers. Externe Proxies werden nur dort verwendet, wo die normalen Cross-Origin-Regeln des Browsers dies erfordern.

---

## 📦 Technologie

- **HTML5** — Anwendungsstruktur
- **CSS3** — Oberfläche, Themes und Animationen
- **JavaScript (ES6+)** — Anwendungslogik
- **Web Storage** — Lokale Einstellungen und Browserdaten
- **Web Crypto API** — Verschlüsselungsunterstützung
- **iframe sandboxing** — Isolation geladener Seiten
- **GitHub Pages** — Statisches Hosting
- **Cloudflare Workers** — Optionaler eigener Proxy
- **Groq API** — Optionale KI-Zusammenfassungen

Es wird kein Frontend-Framework und kein Build-Schritt benötigt.

---

## ⚠️ Bekannte Einschränkungen

VOID läuft innerhalb eines normalen Browser-Tabs und kann daher nicht alle Funktionen eines nativen Browsers bereitstellen.

Einige Webseiten können:

- das Laden innerhalb eines Iframes verweigern;
- Proxy-Verkehr blockieren;
- Authentifizierung verlangen, die über einen Proxy nicht funktioniert;
- aufgrund von CSP- oder Cross-Origin-Einschränkungen nicht korrekt funktionieren;
- kostenlose Proxy-Dienste limitieren.

VOID kann über eine normale statische Webseite außerdem keine echte systemweite Tracker-Blockierung, Paketinspektion, VPN-Funktionalität oder einen eigenen Netzwerk-Stack bereitstellen.

---

## 🗺️ Roadmap

Mögliche zukünftige Verbesserungen:

- [ ] Zuverlässigeres Laden von Webseiten
- [ ] Bessere mobile Navigation
- [ ] Mehr Theme-Anpassungen
- [ ] Verbessertes Lesezeichen-Management
- [ ] Import/Export von Einstellungen und Lesezeichen
- [ ] Mehr Datenschutzkontrollen im Rahmen der Browser-Möglichkeiten
- [ ] Verbesserte PWA-/Mobile-Erfahrung
- [ ] Weitere KI-Werkzeuge
- [ ] Robusteres Proxy-Fallback-Handling

---

## 🤝 Mitmachen

Beiträge, Fehlerberichte und Ideen sind willkommen.

1. Repository forken.
2. Feature-Branch erstellen.
3. Änderungen vornehmen.
4. Lokal testen.
5. Pull Request erstellen.

Bei Fehlern bitte angeben:

- Was erwartet wurde
- Was stattdessen passiert ist
- Browser und Gerät
- Schritte zur Reproduktion
- Konsolenfehler, falls vorhanden

---

## 📜 Lizenz

In diesem Repository ist derzeit keine Lizenz festgelegt.

Wenn andere VOID rechtmäßig wiederverwenden, verändern oder weiterverbreiten können sollen, sollte dem Projekt eine passende Open-Source-Lizenz hinzugefügt werden.

---

## 👤 Projekt

**VOID Browser**  
Erstellt von **LordLOLQDH**

Repository:  
https://github.com/LordLOLQDH/void-browser

Live-Anwendung:  
https://lordlolqdh.github.io/void-browser/

---

<div align="center">

<img src="android-chrome-192x192.png" alt="VOID Browser" width="64">

### VOID

**Privat entwickelt. Für das Web gebaut.**

</div>
