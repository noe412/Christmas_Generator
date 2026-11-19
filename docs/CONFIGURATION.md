# Konfiguration

## Anwendungsparameter – `src/config.ts`

| Schlüssel               | Standard                            | Beschreibung                             |
| ----------------------- | ----------------------------------- | ---------------------------------------- |
| `storageKey`            | `christmas_gift_generator_names_v1` | `localStorage`-Schlüssel der Namensliste |
| `spinStepMs`            | `120`                               | Intervall zwischen Namenswechseln (ms)   |
| `spinTotalMs`           | `6000`                              | Gesamtdauer der Auslosung (ms)           |
| `slideIntervalMs`       | `4000`                              | Slideshow-Intervall (ms)                 |
| `snowflakeCount`        | `40`                                | Anzahl Schneeflocken                     |
| `limits.maxNameLength`  | `60`                                | Max. Zeichen pro Name                    |
| `limits.maxNames`       | `500`                               | Max. Anzahl Namen                        |
| `limits.maxImportBytes` | `262144` (256 KB)                   | Max. Größe einer Import-Datei            |
| `limits.maxImageBytes`  | `15728640` (15 MB)                  | Max. Größe pro Bild                      |
| `limits.maxImages`      | `100`                               | Max. Anzahl Slideshow-Bilder             |

## Sounds

Alle `*.mp3`-Dateien in `src/assets/sounds/` werden beim Build automatisch eingebunden (`import.meta.glob`). Datei hinzufügen oder löschen genügt – kein Code nötig.

## Szene

Das Wohnzimmer ist vollständig in Code gezeichnet (kein Bild-Asset) und liegt in `src/components/scene/`:

| Datei                | Inhalt                                                           |
| -------------------- | ---------------------------------------------------------------- |
| `CozyRoom.tsx`       | Komposition: Wand, Boden, Teppich, Lichtstimmung, Vignette       |
| `Fireplace.tsx`      | Kamin mit Flammen, Glut, Kerzen, Strümpfen                       |
| `ChristmasTree.tsx`  | Baum mit Stern, Lichterkette, Kugeln, Geschenken                 |
| `PanoramaWindow.tsx` | Panoramafenster: Polarlicht, Mond, Berge, Wald, Hütte, Schnee    |
| `SantaSleigh.tsx`    | Weihnachtsmann mit Rentierschlitten (Flugbahn in `index.css`)    |
| `Snowfall.tsx`       | Schneefall über der ganzen Seite                                 |
| `Snowman.tsx`        | Winkender, blinzelnder Schneemann mit wehendem Schal             |
| `SnowPlow.tsx`       | Schneewehe am unteren Rand + Räumwagen (gemeinsamer 48-s-Zyklus) |
| `StringLights.tsx`   | Lichterkette unter der Decke                                     |

Animationen (`flame`, `ember`, `twinkle`, `flicker` …) sind in `src/index.css` unter `@theme` definiert und werden bei `prefers-reduced-motion` automatisch angehalten.

## Farben & Schriften

- Design-Tokens (OKLCH) in `src/index.css` unter `@theme`: `night-*` (Nachtblau), `ember-*` (Kamingold), `cranberry-*` (Hauptfarbe/Buttons), `pine-*`, `snow`, `cream`.
- Schriften: **Fraunces** (Überschriften, `font-display`) und **Inter** (Text, `font-sans`), importiert in `src/main.tsx`.

## Offline-App (PWA)

| Datei                              | Zweck                                                                |
| ---------------------------------- | -------------------------------------------------------------------- |
| `public/manifest.webmanifest`      | Name, Farben, Icons, Startseite                                      |
| `public/icons/`                    | App-Icons (192/512, maskable, Apple Touch)                           |
| `build/pwa.ts`                     | Build-Plugin: erzeugt `sw.js` mit Precache-Liste aller Build-Dateien |
| `src/lib/registerServiceWorker.ts` | Registriert den Service Worker (nur Production-Build)                |

Strategie: Seiten **network-first** (neue Releases sofort sichtbar, offline aus dem Cache), Assets **cache-first** (gehashte Dateinamen). Der Cache-Name enthält einen Hash über Dateinamen und Inhalte; alte Caches werden beim Aktivieren gelöscht.

## Basis-Pfad (Hosting)

| Variable    | Standard                                  | Beschreibung                                   |
| ----------- | ----------------------------------------- | ---------------------------------------------- |
| `BASE_PATH` | `/Christmas_Generator/` (Prod), `/` (Dev) | Öffentlicher Pfad, z. B. `/` für eigene Domain |

```bash
BASE_PATH=/ npm run build
```

> Es werden keine Secrets oder API-Keys benötigt. Lege niemals `.env`-Dateien mit Zugangsdaten im Repository ab.
