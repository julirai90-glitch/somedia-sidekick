# Somedia Sidekick

AI-Assistent für Somedia-Redaktionen. Läuft direkt im Purple Hub CMS als Bookmarklet.

## Funktionen

| Funktion | Was es tut |
|---|---|
| Titel | 5 Vorschläge, je 5-8 Worte, pragnant |
| Lead | 3 Varianten, je 3 Sätze, max 12 Worte pro Satz, catchy |
| Machs kurz | Selektierten Text kurzen, auf den Punkt kommen |
| Synonym | 5 Synonyme fur ein selektiertes Wort |
| Social Posts | Story-Kacheln für Instagram und Facebook (4-6 Kacheln, Dramaturgie) |

## Installation

1. Setup-Seite öffnen: https://julirai90-glitch.github.io/somedia-sidekick/
2. "Sidekick"-Button in die Lesezeichen-Leiste ziehen
3. Artikel im Purple Hub CMS offnen
4. Sidekick-Bookmark klicken

## Architektur

```
Bookmarklet (Browser)
    POST zu n8n.../somedia-sidekick
n8n-Workflow (Server)
    AI Agent (OpenAI gpt-4.1-mini) + Somedia-Sprachrichtlinien
Response zuruck → Anzeige im Sidebar
```

Kein API-Key im Browser. Alles läuft über den n8n-Server.

## Machs kurz / Synonym

Text im CMS-Editor markieren, dann Button klicken. Der Sidekick liest die Selektion (`window.getSelection()`). Fallback: Eingabe-Prompt wenn nichts markiert.

## Tech

- Vanilla JavaScript, Bookmarklet
- n8n als Backend-Proxy
- OpenAI gpt-4.1-mini via n8n AI Agent
- Somedia-Sprachrichtlinien als VectorStore in n8n

## Links

- Setup: https://julirai90-glitch.github.io/somedia-sidekick/
- GitHub: https://github.com/julirai90-glitch/somedia-sidekick
