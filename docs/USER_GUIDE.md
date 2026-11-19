# Benutzerhandbuch

![Ablauf](assets/user-flow.svg)

## Überblick

Die Oberfläche besteht aus drei Bereichen:

- **Bühne** in der Mitte – zeigt Status, Auslosung und Gewinner (optional mit Foto-Slideshow im Hintergrund).
- **Start-Button** darunter – „Start the draw“, nach dem ersten Gewinner „Draw the next helper“.
- **Werkzeugleiste** unten – **Names**, **Photos**, Ton an/aus und **Present**.

Die Einstellungen öffnen sich als Schublade von rechts und schließen mit `Esc`, dem ✕ oder einem Klick daneben.

## 1. Namen hinzufügen

- In der Werkzeugleiste **Names** öffnen, Namen in **„Add a name…“** eingeben und mit **Enter** oder **+** bestätigen.
- Doppelte Namen werden abgelehnt; Leerzeichen werden bereinigt (max. 60 Zeichen, max. 500 Namen).
- Die Liste wird automatisch im Browser gespeichert (`localStorage`) und ist beim nächsten Besuch wieder da.
- Über das ✕ am Namen wird eine Person entfernt.

### Import / Export

- **Export** lädt alle Namen (im Hut und bereits gezogen) als `names.json` herunter.
- **Import** liest eine JSON-Datei ein und ergänzt die vorhandene Liste (Duplikate werden zusammengeführt).

Unterstützte Formate:

```json
["Anna", "Ben", "Clara"]
```

```json
{ "names": ["Anna", "Ben", "Clara"] }
```

## 2. Fotos für die Slideshow (optional)

- In der Werkzeugleiste **Photos** öffnen; **Add photos** akzeptiert beliebig viele Bilddateien (max. 15 MB pro Bild, max. 100 Bilder).
- Die Bilder wechseln automatisch alle 4 Sekunden und können über Pfeile bzw. Punkte manuell gewechselt werden.
- Bilder werden **nicht** gespeichert oder hochgeladen – sie existieren nur im aktuellen Browser-Tab.

## 3. Präsentationsmodus (optional)

- **Present** schaltet in den Vollbildmodus: Überschrift und Werkzeugleiste treten zurück, Bühne und Gewinnername werden größer – ideal für Beamer und TV.
- Ton und **Exit** bleiben oben rechts erreichbar; alternativ mit **Esc** beenden.

## 4. Auslosung starten

- **Start the draw** klicken oder **Enter** / **Leertaste** drücken (solange die Schublade geschlossen ist).
- Die Namen werden ca. 6 Sekunden gemischt; ein Fortschrittsbalken zeigt die verbleibende Zeit. Ist der Ton an, spielt ein zufälliger Jingle.
- Der Gewinner erscheint mit Konfetti und wechselt in die Liste **Already drawn** – so kommt jede Person pro Runde genau einmal dran.

## 5. Neue Runde

- Sind alle gezogen, zeigt die Bühne **Start a new round**.
- Jederzeit möglich über **Names → Already drawn → New round**: Alle Gezogenen kommen zurück in den Hut.

## Ton

Das Lautsprecher-Symbol in der Werkzeugleiste schaltet die Jingles an oder aus. Die Einstellung wird gespeichert.

## Als App installieren & offline nutzen

Der Generator ist eine Progressive Web App. Nach dem ersten Besuch liegen alle Dateien (inkl. Schriften und Jingles) im Browser – danach funktioniert er auch ohne Internet, z. B. am Fernseher bei der Familienfeier.

| Gerät / Browser         | So geht's                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| Chrome / Edge (Desktop) | **Install** in der Werkzeugleiste oder Install-Symbol in der Adresszeile |
| Android (Chrome)        | **Install** in der Werkzeugleiste oder Menü ⋮ → „App installieren“       |
| iPhone / iPad (Safari)  | Teilen-Symbol → „Zum Home-Bildschirm“                                    |
| macOS (Safari 17+)      | Ablage → „Zum Dock hinzufügen“                                           |

- Ohne Verbindung zeigt die Werkzeugleiste **Offline** – alles funktioniert weiter.
- Updates werden beim nächsten Start mit Internet automatisch geladen.

## Tastenkürzel

| Taste             | Aktion                        |
| ----------------- | ----------------------------- |
| `Enter` / `Space` | Auslosung starten             |
| `Enter` im Feld   | Namen hinzufügen              |
| `Esc`             | Vollbild/Präsentation beenden |

## Fairness

Die Auswahl verwendet die Web Crypto API (`crypto.getRandomValues`) mit Rejection Sampling. Jede Person hat exakt die gleiche Wahrscheinlichkeit – ohne den Modulo-Bias einfacher Zufallsfunktionen.

## Datenschutz

Es werden keine Daten an Server übertragen. Es gibt kein Tracking, keine Cookies und keine externen Schriften oder Skripte. Zum Löschen aller Daten genügt es, die Websitedaten im Browser zu entfernen.

## Fehlerbehebung

| Problem                      | Lösung                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Kein Ton                     | Ton-Symbol in der Werkzeugleiste prüfen; Browser blockieren Autoplay bis zur ersten Interaktion.                       |
| Vollbild startet nicht       | Manche Browser (z. B. iOS Safari) unterstützen die Fullscreen-API nicht; der Präsentationsmodus funktioniert trotzdem. |
| Liste nach Neustart leer     | Privater Modus oder blockierter Speicher – Liste vorher exportieren.                                                   |
| „Start the draw“ deaktiviert | Es ist kein Name (mehr) im Hut – Namen hinzufügen oder eine neue Runde starten.                                        |
