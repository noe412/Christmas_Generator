# Architektur

![Architektur](assets/architecture.svg)

## Überblick

Der Christmas Gift Generator ist eine **statische Single-Page-Application** (React 18, TypeScript, Vite, Tailwind CSS). Es gibt kein Backend: Build-Artefakte werden auf GitHub Pages (oder jedem beliebigen Static Host) ausgeliefert.

## Schichten

| Schicht       | Ort              | Verantwortung                                            | Testbarkeit        |
| ------------- | ---------------- | -------------------------------------------------------- | ------------------ |
| UI            | `src/components` | Darstellung, Barrierefreiheit, Layout                    | Integrationstests  |
| Zustand       | `src/hooks`      | State, Seiteneffekte (Timer, Audio, Fullscreen, Storage) | `renderHook`-Tests |
| Logik         | `src/lib`        | Reine Funktionen: Validierung, Zufall, Serialisierung    | Unit-Tests         |
| Konfiguration | `src/config.ts`  | Zeiten, Limits, Storage-Key                              | –                  |

Abhängigkeiten zeigen nur nach unten: Komponenten → Hooks → Lib/Config → Browser-APIs.

## Verzeichnisstruktur

```text
src/
├── App.tsx                     # ErrorBoundary + Root-Komponente
├── main.tsx                    # Einstiegspunkt, Schriften, StrictMode
├── config.ts                   # Zentrale Konfiguration
├── index.css                   # Design-Tokens (@theme), Keyframes, Basis-Styles
├── assets/sounds/              # Jingles (*.mp3 werden automatisch erkannt)
├── components/
│   ├── ChristmasGiftGenerator.tsx  # Composition Root: Szene, Bühne, Start-Button, Werkzeugleiste
│   ├── DrawStage.tsx               # Milchglas-Bühne: Slideshow, Shuffle, Gewinner
│   ├── Confetti.tsx                # Einmaliger Konfetti-Effekt
│   ├── SetupSheet.tsx              # Schublade mit Tabs „Names“ / „Photos“
│   ├── ParticipantsPanel.tsx       # Hut, bereits gezogen, Import/Export
│   ├── SlideshowPanel.tsx          # Fotos hinzufügen/entfernen
│   ├── ErrorBoundary.tsx
│   ├── scene/                      # CozyRoom, Fireplace, ChristmasTree, PanoramaWindow, SantaSleigh, Snowman, SnowPlow, Snowfall, StringLights
│   └── ui/                         # Button, Input, Sheet (Radix Dialog)
├── hooks/
│   ├── useParticipants.ts      # Hut + gezogene Namen + Runden, Persistenz, Import/Export
│   ├── useDraw.ts              # Auslosungs-Zustandsautomat
│   ├── useSlideshow.ts         # Object-URLs + Auto-Advance
│   ├── useJinglePlayer.ts      # Audio
│   ├── useSoundPreference.ts   # Ton an/aus (persistiert)
│   ├── useMotionPreference.ts  # Animationen an/aus (System-Vorgabe + Schalter)
│   ├── useSnowShake.ts         # Schnee abschütteln: ruhend → fällt → wächst nach
│   ├── usePresentationMode.ts  # Fullscreen-Sync
│   ├── useStartShortcut.ts     # Enter/Space
│   ├── useInstallPrompt.ts     # „Install“-Button (beforeinstallprompt)
│   └── useOnlineStatus.ts      # Offline-Anzeige
└── lib/
    ├── names.ts · random.ts · storage.ts · download.ts · seeded.ts · utils.ts
    └── registerServiceWorker.ts
build/
└── pwa.ts                      # Vite-Plugin: generiert den Service Worker (sw.js)
```

## Auslosung (Zustandsautomat)

```text
 idle ──start()──▶ spinning ──(totalMs abgelaufen)──▶ done
  ▲                    │                              │
  └── keine Namen ─────┘ (start() ignoriert)          └──start()──▶ spinning
```

- `useDraw` kopiert die Kandidaten beim Start (stabiler Pool während der Animation).
- Ein `ref` verhindert parallele Auslosungen; Timer werden beim Unmount aufgeräumt.
- Der Gewinner wird über `onWinner` gemeldet; `useParticipants.markDrawn` verschiebt ihn vom Hut in die Liste der Gezogenen. `resetRound` legt alle zurück.

## Designentscheidungen

| Entscheidung                         | Begründung                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kein Backend                         | Kein Betriebsaufwand, keine personenbezogenen Daten auf Servern (DSGVO).                                                                                      |
| Web Crypto statt `Math.random`       | Nachweislich gleichverteilte, nicht vorhersagbare Auswahl.                                                                                                    |
| Object-URLs statt Base64 für Bilder  | Ca. 33 % weniger Speicher, kein Blockieren des Main Threads, explizites Freigeben.                                                                            |
| Self-hosted Fonts (`@fontsource`)    | Keine Requests an Google (DSGVO), funktioniert offline, CSP `font-src 'self'`.                                                                                |
| Animation per `transform`            | Compositor-only, flüssig auf Mobilgeräten.                                                                                                                    |
| CSP nur im Build                     | Der Dev-Server benötigt Inline-Skripte für HMR.                                                                                                               |
| Minimaler Komponentensatz            | Nur tatsächlich genutzte UI-Bausteine – kleinere Angriffsfläche und Bundle.                                                                                   |
| Szene als SVG-Code statt Foto        | Gestochen scharf in jeder Auflösung, animierbar, kaum Bildlast, keine Lizenzfragen.                                                                           |
| Fenster als Ebenen-Stapel            | Große Grafiken bleiben statisch; Bewegtes läuft als `transform`/`opacity`-Ebene auf der GPU (Container-Einheiten `cqw`/`cqh` für bildschirmunabhängige Wege). |
| Lichter in Gruppen animiert          | 6 statt 55 SVG-Animationen – weniger Stil- und Zeichenarbeit pro Bild.                                                                                        |
| Deterministischer Zufall für Deko    | `seeded()` sorgt für identische Szene bei jedem Render, in Tests und Screenshots.                                                                             |
| Eigener Service Worker statt Workbox | ~3 KB, keine Zusatzabhängigkeit, vollständig testbar (`build/pwa.test.ts`).                                                                                   |
| Animationen über `data-motion`       | Folgt „Bewegung reduzieren“ des Systems, lässt sich per Schalter überstimmen.                                                                                 |

## Qualitätssicherung

- `npm run ci` = Prettier-Check → ESLint (0 Warnungen) → `tsc` strict → Vitest → Build.
- GitHub Actions: CI für jeden PR, CodeQL wöchentlich, Dependabot für npm und Actions.
