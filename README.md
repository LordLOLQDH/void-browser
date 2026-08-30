<div align="center">

<img src="android-chrome-192x192.png" alt="VOID Browser Logo" width="128">

# VOID Browser

### A privacy-focused browser interface built for the web.

**Fast · Dark · Private · Local-first**

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

**[Open VOID Browser](https://lordlolqdh.github.io/void-browser/)** · **[View Source](https://github.com/LordLOLQDH/void-browser)**

</div>

---

## What is VOID?

**VOID Browser** is a browser-style web application that runs entirely from a static website. It provides a familiar browsing interface with tabs, navigation, search, bookmarks, history, themes and a privacy-focused control panel — without requiring a dedicated VOID backend.

> **Important:** VOID is a web application, not a replacement for Chrome, Safari, Firefox or another native browser. A website cannot provide its own full rendering engine, TCP/TLS stack or unrestricted network interception. VOID works within normal browser security boundaries and uses proxy-based page loading where required.

---

## ✦ Highlights

| Feature | Description |
|---|---|
| 🗂️ **Multi-tab browsing** | Open, switch, reload and close tabs with independent navigation state. |
| ◀️ **Back / Forward** | Navigate through the history of each tab. |
| 🔎 **Smart address bar** | URLs are opened directly; other input is treated as a search query. |
| 🏠 **Custom start page** | Quick-access tiles and a clean VOID dashboard. |
| 🔖 **Bookmarks** | Save frequently visited pages locally. |
| 🕘 **History** | Keep browsing history on the device. |
| 🛡️ **Privacy Monitor** | Privacy-focused status panel with protection information and request activity. |
| ⚡ **Panic Button** | Quickly clears locally stored VOID data and reloads the application. |
| 🔐 **Local encryption** | Sensitive local data is protected with AES-256-GCM where supported by the app. |
| 🧩 **Sandboxed tabs** | Pages are loaded in sandboxed iframes with a restrictive browser policy. |
| 🚫 **Referrer stripping** | Frames use `no-referrer` to reduce referrer leakage. |
| 🎨 **3 themes** | Void, Ember and Frost. |
| ✦ **AI summaries** | Optional Groq-powered page summaries. |
| 📱 **PWA-ready icons** | Favicons, Apple touch icon and Android Chrome icons are included. |
| 💻 **Keyboard shortcuts** | Desktop shortcuts for tabs, closing tabs and focusing the address bar. |

---

## 🛡️ Privacy & Security

VOID is designed around a **local-first** architecture.

### What stays local

- Browser settings
- Bookmarks
- History
- Local preferences
- Encryption material used by the application
- Groq API key, when configured

VOID itself does not operate a central server or database for your browsing history.

### Protection features

- **Sandboxed iframes** for loaded pages
- **No-referrer policy** on browsing frames
- Local storage for user data
- AES-256-GCM encryption for supported sensitive local data
- Panic Button for clearing local application data

### Privacy Monitor — important limitation

The Privacy Monitor is partly a **visual representation of the protection concept**.

A normal web page cannot inspect all network traffic like a native browser extension or browser engine. Therefore, tracker/cookie counters shown by VOID should **not** be interpreted as forensic network-level blocking statistics.

The architectural protections listed above are real; the simulated/visualized counters are intentionally presented as UI information rather than proof of complete network blocking.

---

## 🌐 How page loading works

GitHub Pages can only serve static files. VOID therefore cannot behave like a complete browser engine.

When a target website permits it, VOID can load it through an external CORS-compatible proxy:

`allorigins.win`  
`corsproxy.io`

Some websites will still refuse to load because of:

- `X-Frame-Options`
- Content Security Policy
- Anti-bot systems
- Authentication restrictions
- Proxy rate limits
- Cross-origin browser security
- Websites that deliberately reject proxy traffic

This is a technical limitation of running a browser interface as a web application — not a bug that can always be solved in frontend JavaScript.

---

## ☁️ Optional: Use your own Cloudflare Worker proxy

For more control and reliability, VOID includes `worker.js`, which can be deployed as a Cloudflare Worker.

### Setup

1. Open the Cloudflare dashboard.
2. Go to **Workers & Pages**.
3. Create a Worker.
4. Paste the contents of `worker.js`.
5. Deploy it.
6. Copy your Worker URL.
7. Open **VOID → Settings → Proxy Endpoint**.
8. Select **Custom Proxy**.
9. Enter your endpoint using:

```text
https://YOUR-WORKER.workers.dev/?url=%URL%
```

The exact availability and limits of third-party services and Cloudflare's plans can change, so check their current documentation before deployment.

---

## ✦ Optional: AI page summaries with Groq

VOID can optionally generate short page summaries using the Groq API.

### Setup

1. Create a Groq API key.
2. Open **VOID → Settings**.
3. Enter the key under **Groq API Key**.
4. Load a page.
5. Press the **✦** button.

The key is stored locally by VOID and is sent directly from the browser to Groq when the feature is used.

> Cross-origin restrictions may prevent VOID from reading the actual content inside some sandboxed pages. In those cases, the AI feature may only be able to work with limited information such as the URL.

---

## 🎨 Themes

VOID currently includes three visual themes:

### VOID
Dark black/green cyber interface.

### EMBER
Dark interface with red/orange accents.

### FROST
Dark interface with blue/cyan accents.

The themes are implemented in `style.css` and can be changed from the application settings.

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + T` | New tab |
| `Ctrl/Cmd + W` | Close current tab |
| `Ctrl/Cmd + L` | Focus address bar |

Touch and mouse interaction are supported through the web interface.

---

## 📱 Icons & branding

VOID includes a complete favicon/app-icon setup:

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

The same VOID logo is used throughout the README, browser branding and application interface.

---

## 🚀 Run VOID locally

No build system is required.

### Option 1 — open directly

Download or clone the repository and open `index.html` in a modern browser.

### Option 2 — local web server

For the most reliable behaviour, serve the project through a local HTTP server.

Example:

```bash
git clone https://github.com/LordLOLQDH/void-browser.git
cd void-browser
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`

---

## 🌍 Deploy with GitHub Pages

1. Open the repository **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch.
5. Select `/(root)`.
6. Save.
7. Wait for GitHub Pages to publish the site.

Live version:

**https://lordlolqdh.github.io/void-browser/**

---

## 📁 Project structure

```text
void-browser/
├── index.html                  # Main application and UI
├── style.css                   # UI, layout, themes and animations
├── app.js                      # Tabs, navigation, storage and application logic
├── worker.js                   # Optional Cloudflare Worker proxy
├── favicon.ico                 # Main browser favicon
├── favicon-16x16.png           # Small favicon
├── favicon-32x32.png           # Standard favicon
├── apple-touch-icon.png        # Apple device icon
├── android-chrome-192x192.png  # Android/PWA icon
├── android-chrome-512x512.png  # Large Android/PWA icon
├── site.webmanifest             # Web app metadata
└── README.md                   # Project documentation
```

---

## 🧠 Architecture

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
        │   Tabs    │    │  Privacy   │   │ Local Data  │
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
       │ Optional CORS   │
       │      Proxy      │
       └────────┬────────┘
                │
                ▼
          Target Website
```

VOID's frontend, interface and local application logic run in the user's browser. External proxies are only used where the browser's normal cross-origin rules require them.

---

## 📦 Technology

- **HTML5** — application structure
- **CSS3** — interface, themes and animations
- **JavaScript (ES6+)** — application logic
- **Web Storage** — local preferences and browser data
- **Web Crypto API** — encryption support
- **iframe sandboxing** — isolation of loaded pages
- **GitHub Pages** — static hosting
- **Cloudflare Workers** — optional custom proxy
- **Groq API** — optional AI summaries

No frontend framework or build step is required.

---

## ⚠️ Known limitations

VOID runs inside a normal browser tab, so it cannot provide all capabilities of a native browser.

Some websites may:

- refuse to load inside an iframe;
- block proxy traffic;
- require authentication that does not work through a proxy;
- break because of CSP or cross-origin restrictions;
- rate-limit free proxy services.

VOID also cannot provide true system-level tracker blocking, packet inspection, VPN functionality or a private network stack from a normal static webpage.

---

## 🗺️ Roadmap

Possible future improvements:

- [ ] More reliable page loading
- [ ] Better mobile navigation
- [ ] More theme customization
- [ ] Improved bookmarks management
- [ ] Import/export of settings and bookmarks
- [ ] More privacy controls within browser capabilities
- [ ] Improved PWA/mobile experience
- [ ] Additional AI tools
- [ ] More robust proxy fallback handling

---

## 🤝 Contributing

Contributions, bug reports and ideas are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test them locally.
5. Open a pull request.

For bugs, include:

- What you expected
- What happened instead
- Browser and device
- Steps to reproduce
- Console errors, if available

---

## 📜 License

No license is currently declared in this repository.

If you want others to legally reuse, modify or redistribute VOID, add an appropriate open-source license to the project.

---

## 👤 Project

**VOID Browser**  
Created by **LordLOLQDH**

Repository:  
https://github.com/LordLOLQDH/void-browser

Live application:  
https://lordlolqdh.github.io/void-browser/

---

<div align="center">

<img src="android-chrome-192x192.png" alt="VOID Browser" width="64">

### VOID

**Private by design. Built for the web.**

</div>
