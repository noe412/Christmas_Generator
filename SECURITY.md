# Security Policy

## Unterstützte Versionen

| Version | Unterstützt |
| ------- | ----------- |
| 1.x     | ✅          |
| < 1.0   | ❌          |

## Sicherheitslücke melden

Bitte **keine öffentlichen Issues** für Sicherheitslücken anlegen. Nutze stattdessen
[GitHub Private Vulnerability Reporting](https://github.com/noe412/Christmas_Generator/security/advisories/new).

Wir bestätigen den Eingang innerhalb von 5 Werktagen und informieren über den weiteren Ablauf.

## Sicherheitsmodell

- Die Anwendung ist eine **rein statische Single-Page-App** ohne Backend, ohne Konten und ohne Tracking.
- Alle Daten (Namen, Bilder) verbleiben im Browser: Namen in `localStorage`, Bilder nur im Arbeitsspeicher (Object-URLs).
- Der Production-Build setzt eine strikte **Content-Security-Policy** (`default-src 'self'`); es werden keine Drittanbieter-Ressourcen geladen.
- Eingaben werden validiert und begrenzt (siehe `src/config.ts`). React escaped alle dargestellten Werte.
- Abhängigkeiten werden durch Dependabot, `npm audit` in der CI und CodeQL überwacht.
- Im Repository befinden sich keine Secrets. `.env`-Dateien sind per `.gitignore` ausgeschlossen.
