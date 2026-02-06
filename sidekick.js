// Somedia Sidekick - Main Script
// Wird via Bookmarklet in Purple Hub CMS injiziert

(function() {
  'use strict';

  // Verhindere mehrfache Initialisierung
  if (window.SOMEDIA_SIDEKICK_LOADED) {
    console.log('Somedia Sidekick already loaded');
    return;
  }
  window.SOMEDIA_SIDEKICK_LOADED = true;

  // ============================================================================
  // KONFIGURATION
  // ============================================================================

  const CLAUDE_API = {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-5-20250929',
    version: '2023-06-01',
    maxTokens: 2048
  };

  const SELECTORS = {
    title: 'h1[contenteditable="true"]',
    lead: '[data-placeholder="Lead"]',
    content: '.ProseMirror',
    images: 'img'
  };

  // ============================================================================
  // API KEY MANAGEMENT
  // ============================================================================

  function getAPIKey() {
    return localStorage.getItem('somedia_sidekick_api_key');
  }

  function setAPIKey(key) {
    localStorage.setItem('somedia_sidekick_api_key', key);
  }

  function promptForAPIKey() {
    const key = prompt('Claude API-Key eingeben:\n\n(Wird nur lokal im Browser gespeichert)');
    if (key && key.trim()) {
      setAPIKey(key.trim());
      return key.trim();
    }
    return null;
  }

  function ensureAPIKey() {
    let key = getAPIKey();
    if (!key) {
      key = promptForAPIKey();
      if (!key) {
        alert('Kein API-Key eingegeben. Sidekick kann nicht gestartet werden.');
        return null;
      }
    }
    return key;
  }

  // ============================================================================
  // CONTENT EXTRACTION
  // ============================================================================

  function extractContent() {
    const content = {
      title: '',
      lead: '',
      body: '',
      images: []
    };

    // Titel extrahieren
    const titleEl = document.querySelector(SELECTORS.title);
    if (titleEl) {
      content.title = titleEl.textContent.trim();
    }

    // Lead extrahieren
    const leadEl = document.querySelector(SELECTORS.lead);
    if (leadEl) {
      content.lead = leadEl.textContent.trim();
    }

    // Hauptinhalt extrahieren
    const contentEl = document.querySelector(SELECTORS.content);
    if (contentEl) {
      content.body = contentEl.textContent.trim();
    }

    // Bilder extrahieren
    const imageEls = document.querySelectorAll(SELECTORS.images);
    imageEls.forEach(img => {
      content.images.push({
        url: img.src,
        alt: img.alt || '',
        title: img.title || ''
      });
    });

    return content;
  }

  function getFullArticleText() {
    const content = extractContent();
    let text = '';

    if (content.title) text += `Titel: ${content.title}\n\n`;
    if (content.lead) text += `Lead: ${content.lead}\n\n`;
    if (content.body) text += `Inhalt:\n${content.body}`;

    return text.trim() || 'Kein Inhalt gefunden';
  }

  // ============================================================================
  // CLAUDE API
  // ============================================================================

  async function callClaudeAPI(systemPrompt, userPrompt) {
    const apiKey = ensureAPIKey();
    if (!apiKey) {
      throw new Error('Kein API-Key verfügbar');
    }

    const response = await fetch(CLAUDE_API.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': CLAUDE_API.version
      },
      body: JSON.stringify({
        model: CLAUDE_API.model,
        max_tokens: CLAUDE_API.maxTokens,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API-Fehler');
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // ============================================================================
  // AI FUNKTIONEN
  // ============================================================================

  async function generateTitles() {
    const content = getFullArticleText();

    const systemPrompt = `Du bist ein erfahrener Redakteur bei Somedia (Südostschweiz).
Erstelle prägnante, informative Titel nach Somedia-Sprachrichtlinien.

REGELN:
- Geschlechtergerecht (neutrale Begriffe oder Doppelformen, KEINE *, :, /)
- 40-70 Zeichen optimal
- Hauptaussage erfassen
- Aktive Verben
- Abkürzungen: 3 Buchstaben groß (UNO), >3 nur erster groß wenn aussprechbar (Fifa)`;

    const userPrompt = `Erstelle 5 Titelvorschläge für diesen Artikel.

${content}

FORMAT: Nur die 5 Titel, nummeriert (1. bis 5.), keine Erklärungen.`;

    return await callClaudeAPI(systemPrompt, userPrompt);
  }

  async function generateAltText() {
    const content = extractContent();
    if (content.images.length === 0) {
      return 'Keine Bilder gefunden im Artikel.';
    }

    const context = `Artikel-Titel: ${content.title}
Artikel-Lead: ${content.lead}`;

    const systemPrompt = `Du bist Experte für barrierefreie Bildbeschreibungen (ALT-Texte).

REGELN:
- Maximal 125 Zeichen
- Sachlich, informativ
- Keine Füllwörter ("Bild von...", "Foto zeigt...")
- Direkt beschreiben`;

    const userPrompt = `Erstelle ALT-Texte für die Bilder in diesem Artikel.

${context}

Anzahl Bilder: ${content.images.length}

FORMAT:
Bild 1: [ALT-Text, max 125 Zeichen]
Bild 2: [ALT-Text, max 125 Zeichen]
...`;

    return await callClaudeAPI(systemPrompt, userPrompt);
  }

  async function checkStyleGuide() {
    const content = getFullArticleText();

    const systemPrompt = `Du bist Korrektor bei Somedia und prüfst Texte auf Einhaltung der Sprachrichtlinien.

SOMEDIA-REGELN:
1. GESCHLECHTERGERECHT: Neutrale Begriffe (Mitarbeitende) oder Doppelformen (Bürgerinnen und Bürger)
   NICHT: *, :, /, -Innen
2. ABKÜRZUNGEN: etc., z. Bsp, usw. NICHT im Lauftext
3. ZAHLEN: Bis 12 ausgeschrieben (drei, zwölf), ab 13 Ziffern (14, 125)
4. WOCHENTAGE: Statt "gestern", "heute", "morgen" → konkreter Wochentag
5. NAMEN: Zeitungen angeführt («NZZ»), Online kleingeschrieben («blick.ch»)

Prüfe auf Verstöße und gib konkrete Verbesserungen.`;

    const userPrompt = `Prüfe diesen Text auf Verstöße gegen Somedia-Sprachrichtlinien.

${content}

FORMAT:
1. [REGEL] - Problem: "..." → Vorschlag: "..."
2. [REGEL] - Problem: "..." → Vorschlag: "..."

Falls OK: "✓ Text entspricht den Richtlinien."`;

    return await callClaudeAPI(systemPrompt, userPrompt);
  }

  async function generateLead() {
    const content = extractContent();
    const articleText = content.body || 'Kein Inhalt vorhanden';

    const systemPrompt = `Du bist Redakteur bei Somedia und erstellst prägnante Leads (Vorspänne).

LEAD-REGELN:
- Maximal 280 Zeichen
- W-Fragen beantworten (Wer, Was, Wann, Wo)
- Geschlechtergerecht
- Ergänzt Titel, wiederholt ihn nicht`;

    const userPrompt = `Erstelle einen Lead für diesen Artikel.

Titel: ${content.title}

Artikel:
${articleText}

FORMAT: Nur der Lead, maximal 280 Zeichen, keine Anführungszeichen.`;

    return await callClaudeAPI(systemPrompt, userPrompt);
  }

  // ============================================================================
  // UI
  // ============================================================================

  function createSidebar() {
    // Prüfe ob schon vorhanden
    if (document.getElementById('somedia-sidekick')) {
      return;
    }

    const sidebar = document.createElement('div');
    sidebar.id = 'somedia-sidekick';
    sidebar.innerHTML = `
      <div class="sidekick-header">
        <h3>🪄 Somedia Sidekick</h3>
        <button class="sidekick-close" onclick="document.getElementById('somedia-sidekick').remove()">×</button>
      </div>
      <div class="sidekick-body">
        <button class="sidekick-btn" data-action="titles">🎯 Titelvorschläge</button>
        <button class="sidekick-btn" data-action="alttext">🖼️ ALT-Texte</button>
        <button class="sidekick-btn" data-action="check">✅ Schreibregeln prüfen</button>
        <button class="sidekick-btn" data-action="lead">📝 Lead generieren</button>
        <div class="sidekick-result" id="sidekick-result"></div>
      </div>
      <div class="sidekick-footer">
        <button class="sidekick-btn-secondary" onclick="localStorage.removeItem('somedia_sidekick_api_key'); alert('API-Key gelöscht');">🔑 API-Key ändern</button>
      </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #somedia-sidekick {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        max-height: 90vh;
        background: white;
        border: 2px solid #2563eb;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .sidekick-header {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .sidekick-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      .sidekick-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 24px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.2s;
      }
      .sidekick-close:hover {
        background: rgba(255,255,255,0.3);
      }
      .sidekick-body {
        padding: 16px;
        overflow-y: auto;
        flex: 1;
      }
      .sidekick-btn {
        width: 100%;
        padding: 12px 16px;
        margin-bottom: 8px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
      }
      .sidekick-btn:hover {
        background: #e5e7eb;
        border-color: #2563eb;
      }
      .sidekick-btn:active {
        transform: scale(0.98);
      }
      .sidekick-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .sidekick-result {
        margin-top: 16px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        display: none;
        max-height: 400px;
        overflow-y: auto;
      }
      .sidekick-result.visible {
        display: block;
      }
      .sidekick-result.loading {
        display: block;
        text-align: center;
        color: #6b7280;
      }
      .sidekick-result.error {
        display: block;
        background: #fee2e2;
        color: #991b1b;
      }
      .sidekick-footer {
        padding: 12px 16px;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
      }
      .sidekick-btn-secondary {
        width: 100%;
        padding: 8px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .sidekick-btn-secondary:hover {
        border-color: #2563eb;
        color: #2563eb;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(sidebar);

    // Event Listeners
    sidebar.querySelectorAll('.sidekick-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', handleAction);
    });
  }

  async function handleAction(e) {
    const action = e.target.dataset.action;
    const resultDiv = document.getElementById('sidekick-result');
    const allButtons = document.querySelectorAll('.sidekick-btn');

    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);

    // Show loading
    resultDiv.className = 'sidekick-result loading';
    resultDiv.textContent = 'Wird generiert...';

    try {
      let result;
      switch(action) {
        case 'titles':
          result = await generateTitles();
          break;
        case 'alttext':
          result = await generateAltText();
          break;
        case 'check':
          result = await checkStyleGuide();
          break;
        case 'lead':
          result = await generateLead();
          break;
      }

      resultDiv.className = 'sidekick-result visible';
      resultDiv.textContent = result;

    } catch (error) {
      resultDiv.className = 'sidekick-result error';
      resultDiv.textContent = `Fehler: ${error.message}`;
      console.error('Sidekick Error:', error);
    } finally {
      // Re-enable buttons
      allButtons.forEach(btn => btn.disabled = false);
    }
  }

  // ============================================================================
  // INIT
  // ============================================================================

  function init() {
    // Prüfe ob im CMS
    if (!window.location.href.includes('purpleshub.com') &&
        !window.location.href.includes('wp-admin')) {
      if (confirm('Sidekick sollte nur im WordPress-CMS verwendet werden. Trotzdem starten?')) {
        createSidebar();
      }
      return;
    }

    // API-Key sicherstellen
    const apiKey = ensureAPIKey();
    if (!apiKey) return;

    // Sidebar erstellen
    createSidebar();

    console.log('✓ Somedia Sidekick geladen');
  }

  // Start
  init();

})();
