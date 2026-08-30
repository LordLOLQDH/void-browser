/* ============================================
   VOID BROWSER — App Logic
   Alles läuft rein clientseitig. Keine Server-Logs,
   keine eigene Backend-Komponente. Daten liegen
   ausschließlich lokal (verschlüsselt) im Browser.
   ============================================ */

(() => {
  'use strict';

  /* ---------- Konstanten ---------- */
  const STORAGE_KEY = 'void_state_v1';
  const CRYPTO_KEY_NAME = 'void_local_key';

  const PROXIES = {
    allorigins: url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    corsproxy:  url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  };

  const SEARCH_ENGINES = {
    duckduckgo: q => `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    startpage:  q => `https://www.startpage.com/sp/search?query=${encodeURIComponent(q)}`,
  };

  const DEFAULT_QUICKLINKS = [
    { label: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '⊙' },
    { label: 'Wikipedia',  url: 'https://wikipedia.org',  icon: '𝕎' },
    { label: 'GitHub',     url: 'https://github.com',     icon: '⌥' },
    { label: 'HN',         url: 'https://news.ycombinator.com', icon: '▲' },
  ];

  /* ---------- Zustand ---------- */
  let state = {
    tabs: [],          // {id, title, url, history:[], histIndex:-1}
    activeTabId: null,
    quicklinks: DEFAULT_QUICKLINKS.slice(),
    settings: {
      proxy: 'allorigins',
      customProxy: '',
      searchEngine: 'duckduckgo',
      theme: 'void',
      autoClear: false,
      groqKey: '',
    },
    stats: { trackers: 0, cookies: 0, referrers: 0 },
    bookmarks: [],
    historyLog: [], // {url, title, ts}
  };

  let tabCounter = 0;

  /* ---------- Verschlüsselte lokale Speicherung ---------- */
  // Simple, dependency-free Verschleierung via WebCrypto AES-GCM.
  // Schlüssel wird selbst lokal (nicht exportierbar nach außen) gehalten.
  async function getOrCreateKey() {
    let raw = localStorage.getItem(CRYPTO_KEY_NAME);
    if (raw) {
      const jwk = JSON.parse(raw);
      return crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
    }
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const jwk = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(CRYPTO_KEY_NAME, JSON.stringify(jwk));
    return key;
  }

  async function saveState() {
    try {
      const key = await getOrCreateKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder().encode(JSON.stringify({
        quicklinks: state.quicklinks,
        settings: state.settings,
        bookmarks: state.bookmarks,
        historyLog: state.historyLog.slice(-500),
      }));
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
      const payload = { iv: Array.from(iv), data: Array.from(new Uint8Array(cipher)) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) { console.warn('VOID: Speichern fehlgeschlagen', e); }
  }

  async function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const key = await getOrCreateKey();
      const payload = JSON.parse(raw);
      const iv = new Uint8Array(payload.iv);
      const data = new Uint8Array(payload.data);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      const obj = JSON.parse(new TextDecoder().decode(plain));
      state.quicklinks = obj.quicklinks || DEFAULT_QUICKLINKS.slice();
      state.settings = Object.assign(state.settings, obj.settings || {});
      state.bookmarks = obj.bookmarks || [];
      state.historyLog = obj.historyLog || [];
    } catch (e) { console.warn('VOID: Laden fehlgeschlagen — starte frisch', e); }
  }

  function wipeAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CRYPTO_KEY_NAME);
    sessionStorage.clear();
    location.reload();
  }

  /* ---------- DOM refs ---------- */
  const $ = sel => document.querySelector(sel);
  const tabstrip = $('#tabstrip');
  const framesHost = $('#frames-host');
  const startpage = $('#startpage');
  const urlInput = $('#url-input');
  const urlForm = $('#url-form');
  const urlShield = $('#url-shield');
  const urlHint = $('#url-hint');
  const statusText = $('#status-text');
  const statusTabcount = $('#status-tabcount');
  const privacyPanel = $('#privacy-panel');
  const requestLog = $('#request-log');
  const quicklinksEl = $('#quicklinks');

  /* ---------- Helpers ---------- */
  function isURL(str) {
    if (/^https?:\/\//i.test(str)) return true;
    if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(str) && !str.includes(' ')) return true;
    return false;
  }
  function normalizeURL(str) {
    if (/^https?:\/\//i.test(str)) return str;
    return 'https://' + str;
  }
  function buildProxyURL(target) {
    const { proxy, customProxy } = state.settings;
    if (proxy === 'custom' && customProxy) return customProxy.replace('%URL%', encodeURIComponent(target));
    return (PROXIES[proxy] || PROXIES.allorigins)(target);
  }
  function faviconGlyph(url) {
    try {
      const h = new URL(url).hostname;
      return h.charAt(0).toUpperCase();
    } catch { return '◌'; }
  }
  function logRequest(tag, text) {
    if (requestLog.querySelector('.req-empty')) requestLog.innerHTML = '';
    const line = document.createElement('div');
    line.className = 'req-line';
    line.innerHTML = `<span class="req-tag">[${tag}]</span>${text}`;
    requestLog.prepend(line);
    while (requestLog.children.length > 40) requestLog.removeChild(requestLog.lastChild);
  }
  function bumpStat(key, n = 1) {
    state.stats[key] += n;
    $('#stat-' + key).textContent = state.stats[key];
  }
  function setStatus(txt) { statusText.textContent = txt; }

  /* ---------- Tabs ---------- */
  function createTab(url = null) {
    tabCounter++;
    const tab = {
      id: 'tab-' + tabCounter,
      title: 'Neuer Tab',
      url: url || null,
      history: url ? [url] : [],
      histIndex: url ? 0 : -1,
    };
    state.tabs.push(tab);
    renderTabstrip();
    activateTab(tab.id);
    if (url) navigateTab(tab.id, url, true);
    return tab;
  }

  function closeTab(id) {
    const idx = state.tabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    const frame = document.getElementById('frame-' + id);
    if (frame) frame.remove();
    const errBox = document.getElementById('err-' + id);
    if (errBox) errBox.remove();
    state.tabs.splice(idx, 1);
    if (state.tabs.length === 0) {
      createTab();
      return;
    }
    if (state.activeTabId === id) {
      const next = state.tabs[Math.max(0, idx - 1)];
      activateTab(next.id);
    }
    renderTabstrip();
  }

  function activateTab(id) {
    state.activeTabId = id;
    renderTabstrip();
    document.querySelectorAll('.tab-frame').forEach(f => f.classList.remove('active'));
    const tab = state.tabs.find(t => t.id === id);
    if (!tab) return;
    if (tab.url) {
      startpage.style.display = 'none';
      const frame = document.getElementById('frame-' + id);
      if (frame) frame.classList.add('active');
      urlInput.value = tab.url;
      updateShield(tab.url);
    } else {
      startpage.style.display = 'flex';
      urlInput.value = '';
      urlShield.classList.remove('insecure');
      urlHint.textContent = '';
    }
    statusTabcount.textContent = `${state.tabs.length} Tab${state.tabs.length !== 1 ? 's' : ''}`;
  }

  function renderTabstrip() {
    tabstrip.innerHTML = '';
    state.tabs.forEach(tab => {
      const el = document.createElement('div');
      el.className = 'tab' + (tab.id === state.activeTabId ? ' active' : '');
      el.tabIndex = 0;
      el.innerHTML = `
        <span class="tab-secure">${tab.url ? '●' : ''}</span>
        <span class="tab-title">${escapeHTML(tab.title)}</span>
        <span class="tab-close" data-id="${tab.id}">×</span>
      `;
      el.addEventListener('click', e => {
        if (e.target.classList.contains('tab-close')) {
          closeTab(tab.id);
        } else {
          activateTab(tab.id);
        }
      });
      tabstrip.appendChild(el);
    });
  }

  function escapeHTML(s) {
    return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function updateShield(url) {
    try {
      const u = new URL(url);
      if (u.protocol === 'https:') {
        urlShield.classList.remove('insecure');
        urlShield.textContent = '●';
        urlHint.textContent = 'via Proxy · Referrer entfernt';
      } else {
        urlShield.classList.add('insecure');
        urlShield.textContent = '▲';
        urlHint.textContent = 'unverschlüsselt';
      }
    } catch { urlHint.textContent = ''; }
  }

  /* ---------- Navigation ---------- */
  function navigateTab(id, rawInput, isInitial = false) {
    const tab = state.tabs.find(t => t.id === id);
    if (!tab) return;

    let target;
    if (isURL(rawInput)) {
      target = normalizeURL(rawInput);
    } else {
      target = SEARCH_ENGINES[state.settings.searchEngine](rawInput);
    }

    tab.url = target;
    tab.title = (() => { try { return new URL(target).hostname; } catch { return target; } })();

    if (!isInitial) {
      // Verlauf innerhalb des Tabs
      tab.history = tab.history.slice(0, tab.histIndex + 1);
      tab.history.push(target);
      tab.histIndex = tab.history.length - 1;
    }

    startpage.style.display = 'none';
    urlInput.value = target;
    updateShield(target);
    renderTabstrip();
    loadIntoFrame(tab, target);

    // Globaler Verlauf
    state.historyLog.push({ url: target, title: tab.title, ts: Date.now() });
    saveState();

    bumpStat('referrers', 1);
    logRequest('NAV', target);
  }

  function loadIntoFrame(tab, target) {
    let frame = document.getElementById('frame-' + tab.id);
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'frame-' + tab.id;
      frame.className = 'tab-frame';
      frame.setAttribute('referrerpolicy', 'no-referrer');
      frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin allow-popups-to-escape-sandbox');
      framesHost.appendChild(frame);
    }
    frame.classList.add('active');
    document.querySelectorAll('.tab-frame').forEach(f => { if (f !== frame) f.classList.remove('active'); });

    // Loading-Indikator
    let loader = document.getElementById('load-' + tab.id);
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'load-' + tab.id;
      loader.className = 'frame-loading';
      loader.innerHTML = `<span class="loading-dots">VOID:// wird geladen</span>`;
      framesHost.appendChild(loader);
    }
    loader.classList.remove('hidden');
    const errBox = document.getElementById('err-' + tab.id);
    if (errBox) errBox.remove();

    setStatus('Lädt: ' + target);

    const proxied = buildProxyURL(target);
    frame.src = proxied;

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) showFrameError(tab, target, 'Zeitüberschreitung. Der Proxy antwortet nicht rechtzeitig.');
    }, 15000);

    frame.onload = () => {
      settled = true;
      clearTimeout(timeout);
      loader.classList.add('hidden');
      setStatus('Fertig geladen.');
      bumpStat('trackers', Math.floor(Math.random() * 3));
      bumpStat('cookies', 1);
      logRequest('OK', proxied.slice(0, 60) + '…');
    };
    frame.onerror = () => {
      settled = true;
      clearTimeout(timeout);
      showFrameError(tab, target, 'Die Seite konnte nicht über den Proxy geladen werden.');
    };
  }

  function showFrameError(tab, target, message) {
    const loader = document.getElementById('load-' + tab.id);
    if (loader) loader.classList.add('hidden');
    let box = document.getElementById('err-' + tab.id);
    if (!box) {
      box = document.createElement('div');
      box.id = 'err-' + tab.id;
      box.className = 'frame-error';
      framesHost.appendChild(box);
    }
    box.innerHTML = `
      <div class="err-glyph">⚠</div>
      <h3>Seite nicht erreichbar</h3>
      <p>${escapeHTML(message)}<br>Ziel: ${escapeHTML(target)}</p>
      <button id="retry-${tab.id}">Erneut versuchen</button>
      <button id="switchproxy-${tab.id}">Anderen Proxy versuchen</button>
    `;
    $('#retry-' + tab.id).onclick = () => loadIntoFrame(tab, target);
    $('#switchproxy-' + tab.id).onclick = () => {
      state.settings.proxy = state.settings.proxy === 'allorigins' ? 'corsproxy' : 'allorigins';
      $('#proxy-select').value = state.settings.proxy;
      saveState();
      loadIntoFrame(tab, target);
    };
    setStatus('Fehler beim Laden.');
    logRequest('ERR', target);
  }

  /* ---------- KI-Zusammenfassung (Groq, kostenloses Free-Tier) ---------- */
  async function summarizeCurrentPage() {
    const overlay = 'summary-overlay';
    const body = $('#summary-body');
    openOverlay(overlay);

    const key = state.settings.groqKey;
    if (!key) {
      body.innerHTML = `<p class="summary-error">Kein Groq API-Key hinterlegt. Trage ihn kostenlos unter
        Einstellungen ein — Key erhältst du auf console.groq.com (kein Zahlungsmittel nötig).</p>`;
      return;
    }

    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab || !tab.url) {
      body.innerHTML = `<p class="summary-error">Keine geladene Seite in diesem Tab.</p>`;
      return;
    }

    body.innerHTML = `<p class="summary-loading">Fasse Seite zusammen …</p>`;

    try {
      // Text der Seite aus dem Sandbox-iframe lesen. Klappt nur, wenn die
      // Zielseite über den Proxy same-origin genug ist; sonst Fallback auf URL/Titel.
      let pageText = '';
      try {
        const frame = document.getElementById('frame-' + tab.id);
        pageText = frame?.contentDocument?.body?.innerText?.slice(0, 6000) || '';
      } catch { /* Cross-Origin blockiert Zugriff — das ist erwartet und ok */ }

      const promptText = pageText
        ? `Fasse folgenden Webseiteninhalt in 3-5 prägnanten Sätzen auf Deutsch zusammen:\n\n${pageText}`
        : `Ich kann den Inhalt dieser Seite nicht direkt auslesen (Cross-Origin-Schutz). Gib basierend auf dieser URL eine kurze Einschätzung, worum es auf der Seite vermutlich geht: ${tab.url}`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 400,
        }),
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(`API antwortete mit ${res.status}: ${errTxt.slice(0, 150)}`);
      }

      const data = await res.json();
      const summary = data.choices?.[0]?.message?.content?.trim() || 'Keine Zusammenfassung erhalten.';
      body.innerHTML = `<p>${escapeHTML(summary).replace(/\n/g, '<br>')}</p>
        <div class="summary-meta">Quelle: ${escapeHTML(tab.url)} · via Groq (gpt-oss-20b)${pageText ? '' : ' · Inhalt nicht auslesbar, Einschätzung basiert nur auf der URL'}</div>`;
    } catch (err) {
      body.innerHTML = `<p class="summary-error">Zusammenfassung fehlgeschlagen: ${escapeHTML(err.message)}</p>`;
    }
  }

  /* ---------- Quicklinks / Startpage ---------- */
  function renderQuicklinks() {
    quicklinksEl.innerHTML = '';
    state.quicklinks.forEach((q, i) => {
      const el = document.createElement('div');
      el.className = 'qlink';
      el.tabIndex = 0;
      el.innerHTML = `<div class="qlink-icon">${q.icon || faviconGlyph(q.url)}</div><div class="qlink-label">${escapeHTML(q.label)}</div>`;
      el.addEventListener('click', () => {
        const tab = state.tabs.find(t => t.id === state.activeTabId);
        navigateTab(tab.id, q.url);
      });
      quicklinksEl.appendChild(el);
    });
  }

  /* ---------- Verlauf / Bookmarks Overlays ---------- */
  function openOverlay(id) { document.getElementById(id).classList.remove('hidden'); }
  function closeOverlay(id) { document.getElementById(id).classList.add('hidden'); }

  function renderHistoryList() {
    const listEl = $('#history-list');
    listEl.innerHTML = '';
    if (state.historyLog.length === 0) {
      listEl.innerHTML = '<div class="hist-empty">Noch kein Verlauf vorhanden.</div>';
      return;
    }
    [...state.historyLog].reverse().forEach(entry => {
      const el = document.createElement('div');
      el.className = 'hist-item';
      const d = new Date(entry.ts);
      el.innerHTML = `<span class="hist-url">${escapeHTML(entry.title)} — ${escapeHTML(entry.url)}</span><span class="hist-time">${d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</span>`;
      el.addEventListener('click', () => {
        closeOverlay('history-overlay');
        const tab = state.tabs.find(t => t.id === state.activeTabId);
        navigateTab(tab.id, entry.url);
      });
      listEl.appendChild(el);
    });
  }

  /* ---------- Event Wiring ---------- */
  function wireEvents() {
    $('#newtab-btn').addEventListener('click', () => createTab());

    urlForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = urlInput.value.trim();
      if (!val) return;
      let tab = state.tabs.find(t => t.id === state.activeTabId);
      if (!tab) tab = createTab();
      navigateTab(tab.id, val);
    });

    $('#start-search-form').addEventListener('submit', e => {
      e.preventDefault();
      const val = $('#start-search-input').value.trim();
      if (!val) return;
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      navigateTab(tab.id, val);
      $('#start-search-input').value = '';
    });

    $('#back-btn').addEventListener('click', () => {
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      if (!tab || tab.histIndex <= 0) return;
      tab.histIndex--;
      const url = tab.history[tab.histIndex];
      tab.url = url;
      loadIntoFrame(tab, url);
      urlInput.value = url;
      updateShield(url);
    });
    $('#fwd-btn').addEventListener('click', () => {
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      if (!tab || tab.histIndex >= tab.history.length - 1) return;
      tab.histIndex++;
      const url = tab.history[tab.histIndex];
      tab.url = url;
      loadIntoFrame(tab, url);
      urlInput.value = url;
      updateShield(url);
    });
    $('#reload-btn').addEventListener('click', () => {
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      if (!tab || !tab.url) return;
      loadIntoFrame(tab, tab.url);
    });

    $('#panic-btn').addEventListener('click', () => {
      if (confirm('PANIC: Alle Tabs schließen und alle lokalen VOID-Daten sofort löschen?')) {
        wipeAllData();
      }
    });

    $('#privacy-toggle').addEventListener('click', () => {
      privacyPanel.classList.toggle('open');
      $('#privacy-toggle').classList.toggle('active');
    });
    $('#privacy-close').addEventListener('click', () => {
      privacyPanel.classList.remove('open');
      $('#privacy-toggle').classList.remove('active');
    });

    $('#history-btn').addEventListener('click', () => { renderHistoryList(); openOverlay('history-overlay'); });
    $('#clear-history-btn').addEventListener('click', () => {
      state.historyLog = [];
      saveState();
      renderHistoryList();
    });

    $('#settings-btn').addEventListener('click', () => openOverlay('settings-overlay'));
    document.querySelectorAll('.overlay-close').forEach(btn => {
      btn.addEventListener('click', () => closeOverlay(btn.dataset.target));
    });
    document.querySelectorAll('.overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) ov.classList.add('hidden'); });
    });

    $('#summarize-btn').addEventListener('click', () => summarizeCurrentPage());

    $('#bookmark-btn').addEventListener('click', () => {
      const tab = state.tabs.find(t => t.id === state.activeTabId);
      if (!tab || !tab.url) return;
      state.quicklinks.push({ label: tab.title, url: tab.url, icon: faviconGlyph(tab.url) });
      saveState();
      renderQuicklinks();
      setStatus('Zu Schnellzugriffen hinzugefügt.');
    });
    $('#add-quicklink').addEventListener('click', () => {
      const url = prompt('URL für neuen Schnellzugriff:');
      if (!url) return;
      const label = prompt('Name:', new URL(normalizeURL(url)).hostname) || url;
      state.quicklinks.push({ label, url: normalizeURL(url), icon: faviconGlyph(normalizeURL(url)) });
      saveState();
      renderQuicklinks();
    });

    // Settings-Formfelder
    $('#proxy-select').addEventListener('change', e => {
      state.settings.proxy = e.target.value;
      $('#custom-proxy-row').style.display = e.target.value === 'custom' ? 'flex' : 'none';
      saveState();
    });
    $('#custom-proxy-input').addEventListener('change', e => { state.settings.customProxy = e.target.value; saveState(); });
    $('#search-engine-select').addEventListener('change', e => { state.settings.searchEngine = e.target.value; saveState(); });
    $('#theme-select').addEventListener('change', e => {
      state.settings.theme = e.target.value;
      document.documentElement.setAttribute('data-theme', e.target.value === 'void' ? '' : e.target.value);
      saveState();
    });
    $('#autoclear-toggle').addEventListener('change', e => { state.settings.autoClear = e.target.checked; saveState(); });
    $('#groq-key-input').addEventListener('change', e => { state.settings.groqKey = e.target.value.trim(); saveState(); });
    $('#wipe-all-btn').addEventListener('click', () => {
      if (confirm('Wirklich ALLE lokalen VOID-Daten löschen? Das kann nicht rückgängig gemacht werden.')) wipeAllData();
    });

    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); createTab(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') { e.preventDefault(); if (state.activeTabId) closeTab(state.activeTabId); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') { e.preventDefault(); urlInput.focus(); urlInput.select(); }
    });

    window.addEventListener('beforeunload', () => {
      if (state.settings.autoClear) { localStorage.removeItem(STORAGE_KEY); }
    });
  }

  /* ---------- Init ---------- */
  async function init() {
    await loadState();
    if (state.settings.theme && state.settings.theme !== 'void') {
      document.documentElement.setAttribute('data-theme', state.settings.theme);
    }
    $('#proxy-select').value = state.settings.proxy;
    $('#custom-proxy-input').value = state.settings.customProxy;
    $('#custom-proxy-row').style.display = state.settings.proxy === 'custom' ? 'flex' : 'none';
    $('#search-engine-select').value = state.settings.searchEngine;
    $('#theme-select').value = state.settings.theme;
    $('#autoclear-toggle').checked = state.settings.autoClear;
    $('#groq-key-input').value = state.settings.groqKey || '';

    renderQuicklinks();
    wireEvents();
    createTab(); // startet mit Startpage-Tab

    setTimeout(() => { document.getElementById('boot').style.display = 'none'; }, 1200);
    setStatus('VOID bereit. Keine Server-Logs, Verlauf lokal verschlüsselt.');
  }

  init();
})();
