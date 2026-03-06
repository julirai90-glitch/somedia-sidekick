// Somedia Sidekick - Main Script
// Wird via Bookmarklet in Purple Hub CMS injiziert

(function() {
  'use strict';

  // Verhindere mehrfache Initialisierung
  if (document.getElementById('somedia-sidekick')) {
    console.log('Somedia Sidekick already loaded');
    return;
  }
  window.SOMEDIA_SIDEKICK_LOADED = true;

  // ============================================================================
  // KONFIGURATION
  // ============================================================================

  const SELECTORS = {
    title: '.editor-post-title__input, .wp-block-post-title, h1[contenteditable="true"]',
    lead: '[data-placeholder="Lead"], .editor-post-excerpt__textarea',
    content: '.block-editor-block-list__layout, .editor-styles-wrapper, .block-editor-writing-flow, .ProseMirror'
  };

  // ============================================================================
  // N8N BACKEND API
  // ============================================================================

  const N8N_API = {
    endpoint: 'https://n8n.julianreich.ch/webhook/somedia-sidekick'
  };

  async function callN8NAPI(type, content, context = {}) {
    const response = await fetch(N8N_API.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: type,
        content: content,
        context: context
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API-Fehler: ${error}`);
    }

    const data = await response.json();
    return data.result;
  }

  // ============================================================================
  // CONTENT EXTRACTION
  // ============================================================================

  function extractContent() {
    const content = { title: '', lead: '', body: '' };

    const titleEl = document.querySelector(SELECTORS.title);
    if (titleEl) content.title = titleEl.textContent.trim();

    const leadEl = document.querySelector(SELECTORS.lead);
    if (leadEl) content.lead = leadEl.textContent.trim();

    const contentEl = document.querySelector(SELECTORS.content);
    if (contentEl) content.body = contentEl.textContent.trim();

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

  function getSelectedText() {
    return window.getSelection().toString().trim();
  }

  // ============================================================================
  // AI FUNKTIONEN
  // ============================================================================

  async function generateTitles() {
    const content = getFullArticleText();
    const extracted = extractContent();
    return await callN8NAPI('titles', content, {
      title: extracted.title,
      lead: extracted.lead
    });
  }

  async function generateLead() {
    const content = extractContent();
    return await callN8NAPI('lead', getFullArticleText(), {
      title: content.title
    });
  }

  async function machsKurz() {
    const selected = getSelectedText();
    const content = selected || prompt('Text zum Kürzen markieren oder hier eingeben:');
    if (!content) return null;
    return await callN8NAPI('machskurz', content, {});
  }

  async function getSynonym() {
    const selected = getSelectedText();
    // Nur erstes Wort verwenden wenn mehrere selektiert
    const word = (selected.split(/\s+/)[0]) || prompt('Wort für Synonyme eingeben:');
    if (!word) return null;
    return await callN8NAPI('synonym', word, {});
  }

  async function generateSocialPost() {
    const content = extractContent();
    return await callN8NAPI('social', getFullArticleText(), {
      title: content.title,
      lead: content.lead
    });
  }

  // ============================================================================
  // ERGEBNIS-RENDERING
  // ============================================================================

  function renderResult(resultDiv, text, action) {
    resultDiv.innerHTML = '';

    if (action === 'social') {
      // Kacheln optisch trennen
      const kacheln = text.split(/KACHEL\s+\d+:/i).filter(k => k.trim());
      if (kacheln.length > 1) {
        kacheln.forEach((kachel, i) => {
          if (i > 0) {
            const divider = document.createElement('hr');
            divider.style.cssText = 'border: none; border-top: 1px solid #ddd; margin: 10px 0;';
            resultDiv.appendChild(divider);
          }
          const label = document.createElement('div');
          label.style.cssText = 'font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;';
          label.textContent = `Kachel ${i + 1}`;
          resultDiv.appendChild(label);
          const p = document.createElement('p');
          p.style.cssText = 'margin: 0 0 2px 0; white-space: pre-wrap;';
          p.textContent = kachel.trim();
          resultDiv.appendChild(p);
        });
      } else {
        const p = document.createElement('p');
        p.style.cssText = 'margin: 0; white-space: pre-wrap;';
        p.textContent = text;
        resultDiv.appendChild(p);
      }
    } else {
      const p = document.createElement('p');
      p.style.cssText = 'margin: 0; white-space: pre-wrap;';
      p.textContent = text;
      resultDiv.appendChild(p);
    }

    // Copy-Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'sidekick-copy-btn';
    copyBtn.textContent = 'Kopieren';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Kopiert!';
        setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 2000);
      });
    };
    resultDiv.appendChild(copyBtn);
  }

  // ============================================================================
  // UI
  // ============================================================================

  function createSidebar() {
    if (document.getElementById('somedia-sidekick')) return;

    const sidebar = document.createElement('div');
    sidebar.id = 'somedia-sidekick';
    sidebar.innerHTML = `
      <div class="sidekick-header">
        <span class="sidekick-title">Somedia Sidekick</span>
        <button class="sidekick-close" onclick="document.getElementById('somedia-sidekick').remove()">×</button>
      </div>
      <div class="sidekick-body">
        <button class="sidekick-btn" data-action="titles">Titel</button>
        <button class="sidekick-btn" data-action="lead">Lead</button>
        <button class="sidekick-btn" data-action="machskurz">Machs kurz</button>
        <button class="sidekick-btn" data-action="synonym">Synonym</button>
        <button class="sidekick-btn" data-action="social">Social Posts</button>
        <div class="sidekick-result" id="sidekick-result"></div>
      </div>
      <div class="sidekick-footer">
        <small>Powered by AI</small>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #somedia-sidekick {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        max-height: 90vh;
        background: white;
        border: 1px solid #000;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .sidekick-header {
        background: #000;
        color: white;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }
      .sidekick-title {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .sidekick-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 22px;
        width: 28px;
        height: 28px;
        border-radius: 2px;
        cursor: pointer;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sidekick-close:hover {
        background: rgba(255,255,255,0.15);
      }
      .sidekick-body {
        padding: 12px;
        overflow-y: auto;
        flex: 1;
      }
      .sidekick-btn {
        width: 100%;
        padding: 10px 14px;
        margin-bottom: 6px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.15s;
        text-align: left;
        color: #111;
      }
      .sidekick-btn:hover {
        background: #f5f5f5;
        border-color: #999;
      }
      .sidekick-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .sidekick-result {
        margin-top: 12px;
        padding: 12px;
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 2px;
        font-size: 13px;
        line-height: 1.6;
        display: none;
        max-height: 420px;
        overflow-y: auto;
      }
      .sidekick-result.visible {
        display: block;
      }
      .sidekick-result.loading {
        display: block;
        text-align: center;
        color: #6b7280;
        font-style: italic;
      }
      .sidekick-result.error {
        display: block;
        background: #fee2e2;
        color: #991b1b;
      }
      .sidekick-copy-btn {
        display: block;
        margin-top: 10px;
        padding: 5px 12px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 2px;
        font-size: 12px;
        cursor: pointer;
        color: #444;
      }
      .sidekick-copy-btn:hover {
        border-color: #555;
        color: #000;
      }
      .sidekick-footer {
        padding: 8px 12px;
        border-top: 1px solid #eee;
        background: white;
        flex-shrink: 0;
      }
      .sidekick-footer small {
        color: #aaa;
        font-size: 11px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(sidebar);

    sidebar.querySelectorAll('.sidekick-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', handleAction);
    });
  }

  async function handleAction(e) {
    const action = e.target.dataset.action;
    const resultDiv = document.getElementById('sidekick-result');
    const allButtons = document.querySelectorAll('.sidekick-btn');

    allButtons.forEach(btn => btn.disabled = true);
    resultDiv.className = 'sidekick-result loading';
    resultDiv.textContent = 'Wird generiert …';

    try {
      let result;
      switch(action) {
        case 'titles':    result = await generateTitles(); break;
        case 'lead':      result = await generateLead(); break;
        case 'machskurz': result = await machsKurz(); break;
        case 'synonym':   result = await getSynonym(); break;
        case 'social':    result = await generateSocialPost(); break;
      }

      if (result === null) {
        resultDiv.className = 'sidekick-result';
        return;
      }

      resultDiv.className = 'sidekick-result visible';
      renderResult(resultDiv, result, action);

    } catch (error) {
      resultDiv.className = 'sidekick-result error';
      resultDiv.textContent = `Fehler: ${error.message}`;
      console.error('Sidekick Error:', error);
    } finally {
      allButtons.forEach(btn => btn.disabled = false);
    }
  }

  // ============================================================================
  // INIT
  // ============================================================================

  function init() {
    if (!window.location.href.includes('purpleshub.com') &&
        !window.location.href.includes('wp-admin')) {
      if (confirm('Sidekick sollte nur im WordPress-CMS verwendet werden. Trotzdem starten?')) {
        createSidebar();
      }
      return;
    }
    createSidebar();
    console.log('✓ Somedia Sidekick geladen');
  }

  init();

})();
