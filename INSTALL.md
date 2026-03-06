# Somedia Sidekick - Installation

## Fur Redakteure (normale Nutzung)

1. Gehe zu: https://julirai90-glitch.github.io/somedia-sidekick/
2. Ziehe den "Sidekick"-Button in die Lesezeichen-Leiste
3. Artikel im Purple Hub CMS offnen
4. Sidekick-Bookmark klicken

Fertig. Kein Account, kein API-Key notig.

---

## Fur Entwickler (lokales Setup)

### Voraussetzungen

- n8n lauft auf https://n8n.julianreich.ch (bereits eingerichtet)
- Workflow ID: ZfqjZj-hIiSYr_egrKOxg

### Lokales Bookmarklet

Script direkt in die Browser-Console einfugen:

```javascript
javascript:(function(){
  var s=document.createElement('script');
  s.src='file:///C:/Users/julir/Claude_Code_Workspace/KI-PROJEKTE/Prototypen/somedia-sidekick/sidekick.js?'+Date.now();
  document.body.appendChild(s);
})();
```

Oder: Setup-Seite offnen → "Script kopieren" klicken → in Browser-Console einfugen.

### n8n-Webhook testen

```bash
curl -X POST https://n8n.julianreich.ch/webhook/somedia-sidekick \
  -H "Content-Type: application/json" \
  -d '{"type": "titles", "content": "Testartikel uber Digitalisierung in Graubunden", "context": {}}'
```

Erwartete Antwort:
```json
{"success": true, "result": "1. ..."}
```

### Request-Format

```json
{
  "type": "titles | lead | machskurz | synonym | social",
  "content": "Text oder Artikel",
  "context": {
    "title": "optional",
    "lead": "optional"
  }
}
```

---

## Troubleshooting

**"Failed to fetch":** n8n-Workflow prufen ob aktiv (https://n8n.julianreich.ch)

**Sidebar erscheint nicht:** Browser-Console offnen (F12), Fehler lesen

**Content nicht gefunden:** Selektoren in sidekick.js prufen - Purple Hub konnte DOM-Struktur geandert haben
