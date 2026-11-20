# Changelog

Alle relevanten Änderungen werden hier dokumentiert. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [2.0.0] – 2026-11-19

### Hinzugefügt

- **Cozy Winter Wonderland**: neues Design mit animiertem Kamin (Flammen, Glut, Kerzen, Strümpfe), geschmücktem Weihnachtsbaum (Stern, Lichterkette, Kugeln, Geschenke), verschneitem Fenster und Lichterkette – vollständig als eigene SVG/CSS-Illustration.
- Moderne Oberfläche: Milchglas-Bühne, schwebende Werkzeugleiste, Einstellungs-Schublade mit Tabs (Radix Dialog), Fortschrittsbalken beim Mischen, goldener Gewinnername mit Konfetti.
- Runden: Liste „Already drawn“ und „New round“; Gezogene werden gespeichert.
- Ton an/aus (gespeichert).
- Schriften Fraunces und Inter (selbst gehostet).
- Großes Panoramafenster mit Vorhängen, Polarlicht, Sternschnuppen, Bergen, Tannenwald, Hütte mit Rauch und Schneefall.
- Weihnachtsmann mit Rentierschlitten, der regelmäßig vorbeifliegt.
- Winkender Schneemann auf einer Schneewehe im Fenster.
- Schneepflug: Am unteren Bildschirmrand wächst eine Schneewehe, die ein Räumwagen regelmäßig wegschiebt.
- Schnee abschütteln: Klick auf den Schnee von Bühne oder Werkzeugleiste – Karte wackelt, Schnee fällt herunter und wächst langsam nach.
- Animationen-Schalter: folgt standardmäßig „Bewegung reduzieren“ des Systems, lässt sich überstimmen (gespeichert).
- Schneefall über der ganzen Seite; Schnee, der sich auf Bühne und Werkzeugleiste setzt.
- Offline-App (PWA): Manifest, Icons, eigener Service Worker mit Precache, „Install“-Button und Offline-Anzeige.

### Geändert

- Design-Tokens nativ in Tailwind 4 (`@theme`), `tailwind.config.ts` entfällt.
- Präsentationsmodus ohne Skalierungs-Hack: responsive Bühne, kompakte Steuerung oben rechts.

### Entfernt

- Hintergrundfoto (durch Code-Illustration ersetzt), alte Schriften, `FitToViewport`, `AppHeader`, `Snowfall`, `Card`.

### Behoben

- Leertaste nach Klick auf „Present“ beendete den Präsentationsmodus, statt die Auslosung zu starten.

## [1.1.0] – 2026-11-18

### Hinzugefügt

- `docs/ASSETS.md`: Herkunft und Lizenzstatus der Medien dokumentiert.
- Tests für `useSlideshow`.

### Geändert

- Laufzeit auf Node.js 26 LTS umgestellt (`.nvmrc`, CI, Deployment) und `@types/node` auf 26 angehoben; Mindestversion 22.12.
- Upgrade auf Tailwind CSS 4 (Vite-Plugin statt PostCSS) und tailwind-merge 3; `tailwindcss-animate`, `autoprefixer` und `postcss` entfallen.
- Upgrade auf eslint-plugin-react-hooks 7; Hooks an die neuen Regeln angepasst (keine Ref-Zuweisungen im Render, kein synchrones `setState` in Effects).
- GitHub Actions aktualisiert (checkout v7, setup-node v7, codeql-action v4, upload-pages-artifact v5, deploy-pages v5).

### Entfernt

- Versehentlich eingecheckte `*.tsbuildinfo`-Build-Artefakte.

## [1.0.0] – 2026-11-18

### Hinzugefügt

- Modulare Architektur: reine Logik (`src/lib`), Hooks (`src/hooks`), UI-Komponenten (`src/components`), zentrale Konfiguration (`src/config.ts`).
- Kryptografisch faire, unverzerrte Auslosung über die Web Crypto API.
- Eingabevalidierung und Limits (Namenslänge, Listengröße, Import- und Bildgröße).
- Unit- und Integrationstests (Vitest, Testing Library), Coverage-Report.
- CI-Pipeline (Format, Lint, Typecheck, Tests, Build, `npm audit`), CodeQL, Dependabot.
- Content-Security-Policy im Production-Build; selbst gehostete Schriften (keine Drittanbieter-Requests).
- Barrierefreiheit: Labels, `aria-live`-Ansagen, Fokus-Styles, `prefers-reduced-motion`.
- ErrorBoundary, Logo, Favicon, Projektgrafiken und vollständige Dokumentation.
- MIT-Lizenz, Security Policy, Contributing Guide, Issue-/PR-Templates.

### Geändert

- Upgrade auf Vite 7 / Vitest 5; TypeScript `strict`-Modus aktiviert.
- Schneefall-Animation über `transform` statt `top` (GPU-beschleunigt, kein Layout-Thrashing).
- Slideshow-Bilder als Object-URLs statt Base64 (deutlich geringerer Speicherbedarf, sauberes Freigeben).
- JS-Bundle von 327 kB auf ca. 195 kB reduziert.

### Behoben

- Dreifach gerenderter „Beenden“-Button im Präsentationsmodus.
- Mehrfachstart der Auslosung per Tastatur während einer laufenden Auslosung.
- Enter/Leertaste auf fokussierten Buttons löste zusätzlich die Auslosung aus.
- Gewinnername ohne Slideshow (weiß auf weiß) nicht lesbar.
- Fehlende Schriftdateien und Favicon (404-Requests).

### Entfernt

- 46 ungenutzte UI-Komponenten, Router, React Query, Toast-Systeme und ca. 135 ungenutzte npm-Pakete.
- Generator-Reste (`lovable-tagger`, `bun.lockb`, Platzhalter-Dateien, Debug-Schritte im Deployment).
