# Somedia Sidekick - Anleitung

AI-Assistent fur den Purple Hub CMS-Alltag. Kein Login, kein API-Key, einfach benutzen.

---

## Installation

1. Gehe zu: https://julirai90-glitch.github.io/somedia-sidekick/
2. Ziehe den "Sidekick"-Button in deine Lesezeichen-Leiste
3. Fertig

---

## Verwendung

1. Artikel im Purple Hub CMS offnen
2. Sidekick-Bookmark klicken
3. Sidebar erscheint rechts im Browser
4. Funktion klicken → Ergebnis erscheint darunter
5. "Kopieren" klicken um den Text zu ubernehmen

---

## Funktionen

### Titel

Liest den ganzen Artikel und gibt 5 Titelvorschlage zuruck. Je 5 bis 8 Worte. Pragnant, kein Clickbait.

Wann: Wenn du Inspiration brauchst oder verschiedene Winkel sehen willst.

Beispiel-Output:
```
1. Graubunden investiert in die Schul-Digitalisierung
2. Funf Millionen fur Bildung und Wirtschaft
3. Kantonsregierung startet Digitalisierungsprogramm
4. Neue Fordergelder fur Start-ups im Kanton
5. Schulen und Unternehmen profitieren von Investitionspaket
```

---

### Lead

Gibt 3 Lead-Varianten zuruck. Je genau 3 Satze. Jeder Satz maximal 12 Worte. Catchy, macht Lust auf den Artikel.

Wann: Wenn der Einstieg nicht sitzt oder du verschiedene Tonalitaten ausprobieren willst.

Beispiel-Output:
```
VARIANTE 1:
Der Kanton Graubunden investiert funf Millionen Franken. Das Geld fliesst in Schulen, Start-ups und Infrastruktur. Das Programm startet im Fruhling.

VARIANTE 2:
Funf Millionen fur die Digitalisierung - der Kanton macht Ernst. Schulkinder und Unternehmen profitieren gleichermassen. Die Regierung prasentierte das Programm am Montag.

VARIANTE 3:
Graubunden bekommt ein neues Digitalisierungsprogramm. Insgesamt funf Millionen Franken stehen bereit. Wer davon profitiert - und wie man sich bewirbt.
```

---

### Machs kurz

Kürzt selektierten Text. Streicht unnötige Worte, kommt auf den Punkt. Gleiche Sprache, gleicher Ton.

Wann: Text im CMS-Editor markieren, dann "Machs kurz" klicken. Kein Text markiert? Ein Eingabe-Prompt erscheint.

Ideal fur: Zu lange Satze, uberlastete Absatze, schwerfällige Formulierungen.

---

### Synonym

Gibt 5 Synonyme fur ein Wort zuruck. Passend zum journalistischen Kontext.

Wann: Ein Wort im CMS-Editor markieren (oder nur das erste Wort einer Selektion), dann "Synonym" klicken.

Beispiel fur "Investition":
```
1. Ausgabe
2. Forderung
3. Finanzierung
4. Einsatz
5. Mittelzuweisung
```

---

### Social Posts

Erstellt Story-Kacheln fur Instagram und Facebook. 4 bis 6 Kacheln. Jede Kachel maximal 3 Satze. Gute Dramaturgie: Hook → Kontext → Kernaussage → Auflosung → CTA.

Wann: Nach dem Schreiben des Artikels, fur Social-Media-Verbreitung.

Beispiel-Output:
```
KACHEL 1:
Funf Millionen Franken fur Graubunden. Was passiert damit? Das musst du wissen.

KACHEL 2:
Der Kanton investiert - und zwar in Schulen und Start-ups gleichzeitig. Ein Programm, zwei Ziele.

KACHEL 3:
Fur Schulkinder heisst das: bessere Gerate, modernere Lernumgebungen. Fur Unternehmen: Fordergelder fur digitale Projekte.

KACHEL 4:
Startschuss ist im Fruhling. Wer sich bewirbt, hat Chancen auf direkte Unterstutzung.

KACHEL 5:
Graubunden zeigt, wie Digitalisierung geht. Mehr im Artikel - Link in Bio.
```

---

## Somedia-Sprachrichtlinien

Der Sidekick kennt die Regeln und wendet sie automatisch an:

**Geschlechtergerecht:** Mitarbeitende, Studierende, Fuhrungskraft - oder Doppelformen wie "Burgerinnen und Burger". Nicht erlaubt: *, :, /, Binnen-I.

**Abkurzungen:** Bis 3 Buchstaben gross (GKB, UNO). Mehr als 3: nur erster Buchstabe gross wenn aussprechbar (Fifa, Unesco). Im Lauftext kein "etc.", "usw.", "z.Bsp.".

**Zahlen:** Bis 12 ausgeschrieben. Ab 13 Ziffern. Geldbetrüge immer Ziffern.

**Wochentage:** Nicht "gestern/heute/morgen" - sondern "am Montag", "am Dienstag" usw.

**Kupplungen:** Tee-Ei, See-Elefant (drei gleiche Vokale). Corona-Epidemie (unubersichtlich).

**Namen:** Zeitungen in Guillemets («Bundner Tagblatt»). Kurzel ohne (NZZ). Online-Portale klein + Guillemets («suedostschweiz.ch»).

---

## Problembehebung

**Sidekick ladt nicht:**
1. Browser-Console offnen (F12) → Fehler prufen
2. Sicherstellen, dass du im Purple Hub CMS bist
3. Seite neu laden, dann Bookmark erneut klicken

**"Wird generiert..." erscheint, aber kein Ergebnis:**
1. Browser-Console prufen (F12 → Console-Tab)
2. Prufen ob n8n erreichbar ist: https://n8n.julianreich.ch
3. Falls n8n down: Julian informieren

**Content wird nicht gefunden:**
Der Sidekick liest Titel, Lead und Inhalt aus dem DOM. Wenn das CMS seine Struktur andert, mussen die Selektoren in sidekick.js angepasst werden.

---

## Technischer Hintergrund

Der Sidekick schickt den Artikel-Text an einen n8n-Server. Dort wird ein AI Agent (OpenAI gpt-4.1-mini) mit den Somedia-Sprachrichtlinien kombiniert und gibt das Ergebnis zuruck. Kein API-Key im Browser notwendig.

```
Browser → POST → n8n (n8n.julianreich.ch) → AI Agent → Response → Sidebar
```
