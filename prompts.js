// Somedia Sidekick - Prompt-Referenz
// Hinweis: Die eigentlichen Prompts laufen im n8n-Workflow.
// Diese Datei dient als Referenz / lokale Dokumentation.

const SOMEDIA_RULES = `
SOMEDIA-SPRACHRICHTLINIEN (Auszug):

1. GESCHLECHTERGERECHT SCHREIBEN
   - Neutrale Begriffe verwenden (Mitarbeitende, Studierende, Führungskraft)
   - Oder Doppelformen (Bürgerinnen und Bürger, Politikerinnen und Politiker)
   - NICHT erlaubt: Mitarbeiter*innen, Konsument:innen, Mitarbeiter/-innen

2. ABKÜRZUNGEN
   - 3 Buchstaben: Großgeschrieben (GKB, DMO, UNO)
   - Mehr als 3: Nur erster Buchstabe groß wenn aussprechbar (Fifa, Unesco, Neat)
   - Im Lauftext NICHT erlaubt: etc., z. Bsp, usw.

3. ZAHLEN
   - Bis 12: Ausgeschrieben (drei, zwölf)
   - Ab 13: Ziffern (14, 125)
   - Geldbeträge: Immer Ziffern (80 Rappen, 5000 Franken)

4. WOCHENTAGE
   - Statt "gestern", "heute", "morgen" → Wochentag schreiben
   - Beispiel: "am Montag" statt "gestern"

5. KUPPLUNGEN (Bindestriche)
   - Bei drei gleichen Vokalen: Tee-Ei, See-Elefant
   - Unübersichtliche Wörter: Corona-Epidemie, Mehrzweck-Küchenmaschine

6. NAMEN
   - Zeitungstitel: Angeführt («Bündner Tagblatt»)
   - Zeitungskürzel: Nicht angeführt (NZZ, BaZ)
   - Online-Portale: Kleingeschrieben + angeführt («suedostschweiz.ch»)
`;

// Funktionen (Referenz – Prompts laufen in n8n):
//
// titles      → 5 Titelvorschläge, 5–8 Worte, prägnant, kein Clickbait
// lead        → 3 Varianten, je 3 Sätze, max 12 Worte/Satz, catchy
// machskurz   → Selektierten Text kürzen, Kernaussage behalten
// synonym     → 5 Synonyme für ein Wort, journalistischer Kontext
// social      → Story-Kacheln (4–6), max 3 Sätze je, Dramaturgie: Hook→CTA

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOMEDIA_RULES };
}
