# Medien & Lizenzen

Der **Quellcode** steht unter der [MIT-Lizenz](../LICENSE). Das gilt seit Version 2.0 auch für die gesamte Szene (Kamin, Baum, Fenster, Lichterkette): Sie ist als eigener SVG-/CSS-Code in `src/components/scene/` umgesetzt – das frühere Hintergrundfoto wurde entfernt.

Für die Sounds in `src/assets/sounds/` gilt Folgendes:

## Status

Laut Maintainer wurden alle Sounds aus **lizenzfreien Quellen** bezogen. Die konkreten Quellen wurden zum Zeitpunkt der Aufnahme ins Repository (2025-11-06) **nicht dokumentiert**. Die Dateien enthalten keine Metadaten (ID3-Tags, EXIF) mit Herkunfts- oder Lizenzangaben.

| Datei                       | Typ   | Dauer / Größe | Quelle        | Lizenz                         |
| --------------------------- | ----- | ------------- | ------------- | ------------------------------ |
| `christmas-background.jpg`  | Bild  | 1920×1080     | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/bells.mp3`          | Audio | 5,7 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/deck-the-halls.mp3` | Audio | 8,0 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/ho-ho-ho-1.mp3`     | Audio | 4,3 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/ho-ho-ho-2.mp3`     | Audio | 5,1 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/melody.mp3`         | Audio | 6,2 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/music-box.mp3`      | Audio | 27,8 s        | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/outro.mp3`          | Audio | 7,7 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/sleigh-bells-1.mp3` | Audio | 7,2 s         | nicht erfasst | lizenzfrei (Angabe Maintainer) |
| `sounds/sleigh-bells-2.mp3` | Audio | 31,1 s        | nicht erfasst | lizenzfrei (Angabe Maintainer) |

> **Hinweis für Weiterverwender:** Die MIT-Lizenz deckt diese Medien nicht ab. Wer das Projekt kommerziell oder in einem Umfeld mit Compliance-Anforderungen einsetzt, sollte die Medien durch Dateien mit nachweisbarer Lizenz ersetzen (siehe unten).

## Regel für neue oder ersetzte Medien

Jede neue Datei wird **im selben Commit** in der Tabelle oben eingetragen – mit Quelle (URL), Urheber und Lizenz. Empfohlene Quellen mit klaren Lizenzen:

- [Freesound](https://freesound.org) – Filter auf **CC0** (keine Namensnennung nötig)
- [Pixabay](https://pixabay.com) – Pixabay Content License (kommerziell nutzbar, keine Namensnennung nötig)
- [Unsplash](https://unsplash.com) – Unsplash License (Bilder)

Sounds werden automatisch aus `src/assets/sounds/*.mp3` geladen; zum Austausch genügt das Ersetzen der Datei (siehe [Konfiguration](CONFIGURATION.md#sounds)).
