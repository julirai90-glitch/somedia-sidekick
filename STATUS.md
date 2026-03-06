# Somedia Sidekick - Status

Stand: Marz 2026

---

## Aktueller Stand: Produktiv

Der Sidekick lauft. Alle funf Funktionen sind implementiert und uber n8n verbunden.

### Funktionen

| Funktion | Status | Typ |
|---|---|---|
| Titel | aktiv | ganzer Artikel → 5 Vorschlage, 5-8 Worte |
| Lead | aktiv | ganzer Artikel → 3 Varianten, 3 Satze, max 12 Worte |
| Machs kurz | aktiv | selektierter Text → gekurzter Text |
| Synonym | aktiv | selektiertes Wort → 5 Synonyme |
| Social Posts | aktiv | ganzer Artikel → 4-6 Story-Kacheln |

Entfernt: ALT-Texte, Schreibregeln-Check.

### Architektur

```
Bookmarklet → POST → n8n Webhook → Switch → Prompt-Node → AI Agent → Response
```

- Webhook: https://n8n.julianreich.ch/webhook/somedia-sidekick
- AI: OpenAI gpt-4.1-mini via n8n AI Agent
- Sprachrichtlinien: Als VectorStore in n8n (knowledge_base Tool)
- Kein API-Key im Browser

### Deployment

- GitHub: https://github.com/julirai90-glitch/somedia-sidekick
- GitHub Pages: https://julirai90-glitch.github.io/somedia-sidekick/
- n8n Workflow ID: ZfqjZj-hIiSYr_egrKOxg

---

## Letzte Anderungen (Marz 2026)

- Neue Funktionen: Machs kurz, Synonym
- Lead uberarbeitet: 3 Varianten, Satz-Langenregel
- Social Posts: Story-Kacheln mit Dramaturgie
- UI: Buttons ohne Icons, superclean schwarzes Design
- ALT-Texte und Schreibregeln-Check entfernt
- n8n: Switch und Prompt-Nodes aktualisiert
