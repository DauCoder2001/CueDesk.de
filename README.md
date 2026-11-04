# CueDesk.de

Website von CueDesk, ausgeliefert über GitHub Pages unter https://www.cuedesk.de.
Bei IONOS zeigt ein CNAME-Eintrag für `www` auf `daucoder2001.github.io`.
Die App selbst liegt unter https://app.cuedesk.de (Repository `cuedesk-app`).

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite |
| `funktionen.html` | alle Funktionen im Detail |
| `fuer-vereine.html` | Einstieg, Voraussetzungen, Datenschutz |
| `fragen.html` | häufige Fragen |
| `kontakt.html` | Kontaktformular (App) und E-Mail |
| `404.html` | Fehlerseite (absolute Pfade, weil sie unter jeder Adresse erscheint) |
| `assets/stil.css` | gemeinsame Gestaltung |
| `assets/seite.js` | **Versionsnummer** (`VERSION`), Menü, Jahr im Fuß |
| `bilder/` | Logo und Icons (aus der App übernommen) |

Kopf und Fuß stehen in jeder Seite einzeln. Wer das Menü ändert, ändert es in allen Seiten.
Impressum, Datenschutz und Verträge werden nur in der App gepflegt und hier verlinkt.

## Bildschirmfotos

Die Kästen mit „Bildschirmfoto folgt“ sind Platzhalter (`<div class="bildplatz">`).
Später durch `<img src="bilder/…" alt="…">` ersetzen. Fotos nur aus der Testfassung mit erfundenen Namen.

## Lokal ansehen

    npx http-server -p 8080 -c-1

## Version

Bei jeder Änderung `VERSION` in `assets/seite.js` erhöhen und `CHANGELOG.md` ergänzen.
