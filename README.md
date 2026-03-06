# Somedia Sidekick

AI-Assistent fur Somedia-Redaktionen. Lauft direkt im Purple Hub CMS als Bookmarklet.

## Funktionen

| Funktion | Was es tut |
|---|---|
| Titel | 5 Vorschlage, je 5-8 Worte, pragnant |
| Lead | 3 Varianten, je 3 Satze, max 12 Worte pro Satz, catchy |
| Machs kurz | Selektierten Text kurzen, auf den Punkt kommen |
| Synonym | 5 Synonyme fur ein selektiertes Wort |
| Social Posts | Story-Kacheln fur Instagram und Facebook (4-6 Kacheln, Dramaturgie) |

## Installation

1. Setup-Seite offnen: https://julirai90-glitch.github.io/somedia-sidekick/
2. "Sidekick"-Button in die Lesezeichen-Leiste ziehen
3. Artikel im Purple Hub CMS offnen
4. Sidekick-Bookmark klicken

## Architektur

```
Bookmarklet (Browser)
    POST zu https://n8n.julianreich.ch/webhook/somedia-sidekick
n8n-Workflow (Server)
    AI Agent (OpenAI gpt-4.1-mini) + Somedia-Sprachrichtlinien
Response zuruck → Anzeige im Sidebar
```

Kein API-Key im Browser. Alles lauft uber den n8n-Server.

## Machs kurz / Synonym

Text im CMS-Editor markieren, dann Button klicken. Der Sidekick liest die Selektion (`window.getSelection()`). Fallback: Eingabe-Prompt wenn nichts markiert.

## Tech

- Vanilla JavaScript, Bookmarklet
- n8n als Backend-Proxy
- OpenAI gpt-4.1-mini via n8n AI Agent
- Somedia-Sprachrichtlinien als VectorStore in n8n

## Links

- Setup: https://julirai90-glitch.github.io/somedia-sidekick/
- n8n-Workflow: https://n8n.julianreich.ch/workflow/ZfqjZj-hIiSYr_egrKOxg
- GitHub: https://github.com/julirai90-glitch/somedia-sidekick
