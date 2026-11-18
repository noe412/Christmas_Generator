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

## Hintergrund

`src/assets/christmas-background.jpg` ersetzen (empfohlen: 1920×1080, < 300 KB, JPEG/WebP).

## Farben & Schriften

- Farb-Tokens (HSL) in `src/index.css` unter `:root` (z. B. `--primary`, `--secondary`, `--accent`).
- Schriften werden in `src/main.tsx` über `@fontsource/*` importiert und in `tailwind.config.ts` (`fontFamily`) zugeordnet.

## Basis-Pfad (Hosting)

| Variable    | Standard                                  | Beschreibung                                   |
| ----------- | ----------------------------------------- | ---------------------------------------------- |
| `BASE_PATH` | `/Christmas_Generator/` (Prod), `/` (Dev) | Öffentlicher Pfad, z. B. `/` für eigene Domain |

```bash
BASE_PATH=/ npm run build
```

> Es werden keine Secrets oder API-Keys benötigt. Lege niemals `.env`-Dateien mit Zugangsdaten im Repository ab.
