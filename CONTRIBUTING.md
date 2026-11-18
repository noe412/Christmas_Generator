# Contributing

Danke für deinen Beitrag! 🎄

## Setup

```bash
nvm use            # Node-Version aus .nvmrc
npm ci
npm run dev        # http://localhost:8080
```

## Workflow

1. Branch von `main` erstellen: `feat/<thema>`, `fix/<thema>` oder `docs/<thema>`.
2. Änderungen inkl. Tests umsetzen.
3. Lokal die komplette Pipeline ausführen: `npm run ci`.
4. Pull Request mit ausgefülltem Template öffnen.

## Konventionen

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/de/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Code-Stil:** Prettier + ESLint (`npm run format`, `npm run lint`). Keine Warnungen erlaubt.
- **TypeScript:** `strict`-Modus; kein `any` ohne Begründung.
- **Architektur:** Reine Logik nach `src/lib`, Zustand/Effekte in `src/hooks`, Darstellung in `src/components`. Konfigurierbare Werte nach `src/config.ts`.
- **Tests:** Neue Logik in `src/lib` und `src/hooks` benötigt Unit-Tests.
- **Sicherheit:** Keine Secrets, Tokens, internen Hostnamen oder IP-Adressen committen. Keine externen Requests ohne Anpassung der CSP und Review.
- **Changelog:** Nutzerrelevante Änderungen in `CHANGELOG.md` unter „Unreleased“ eintragen.
