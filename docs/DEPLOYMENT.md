# Deployment & Betrieb

## Voraussetzungen

- Node.js **26 LTS** (Version aus `.nvmrc`, in CI und Deployment verwendet); mindestens 22.12
- npm ≥ 10

## Browser-Unterstützung

Aktuelle Versionen von Chrome/Edge (≥ 111), Firefox (≥ 128) und Safari (≥ 16.4) – Voraussetzung von Tailwind CSS 4. Ältere Smart-TV-Browser werden ggf. nicht korrekt dargestellt; für Präsentationen einen Laptop mit aktuellem Browser verwenden.

## Lokaler Build

```bash
npm ci
npm run build      # Typecheck + Production-Build nach dist/
npm run preview    # http://localhost:4173/Christmas_Generator/
```

## GitHub Pages (Standard)

Der Workflow [`deploy.yml`](../.github/workflows/deploy.yml) läuft bei jedem Push auf `main`:

1. `npm ci`
2. Quality Gate: Lint, Typecheck, Tests
3. Build, `404.html` (SPA-Fallback) und `.nojekyll` erzeugen
4. Upload als Pages-Artefakt und Deployment

**Einmalige Einrichtung:** _Settings → Pages → Source: GitHub Actions_.

## Andere Hosts (Netlify, Nginx, S3, Azure Static Web Apps …)

```bash
BASE_PATH=/ npm run build
```

Den Inhalt von `dist/` ausliefern. Empfohlene HTTP-Header (zusätzlich zur eingebetteten CSP):

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;

location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location = /index.html {
  add_header Cache-Control "no-cache";
}
```

## CI/CD-Übersicht

| Workflow     | Auslöser                       | Zweck                                                         |
| ------------ | ------------------------------ | ------------------------------------------------------------- |
| `ci.yml`     | Pull Requests, Push auf `main` | Format, Lint, Typecheck, Tests + Coverage, Build, `npm audit` |
| `deploy.yml` | Push auf `main`, manuell       | Build & Deployment auf GitHub Pages                           |
| `codeql.yml` | PRs, `main`, wöchentlich       | Statische Sicherheitsanalyse                                  |
| Dependabot   | wöchentlich / monatlich        | Updates für npm und GitHub Actions                            |

## Empfohlene Repository-Einstellungen

- Branch Protection für `main`: PR-Pflicht, Status-Check **CI** erforderlich, keine Force-Pushes.
- _Settings → Code security_: Dependabot Alerts, Secret Scanning und Push Protection aktivieren.
- Private Vulnerability Reporting aktivieren (siehe [SECURITY.md](../SECURITY.md)).
- Beschreibung, Website und Topics gemäß [`.github/settings.yml`](../.github/settings.yml) setzen.

## Rollback

Über _Actions → Deploy to GitHub Pages → Re-run_ eines früheren erfolgreichen Laufs oder per `git revert` auf `main`.

## Lizenzen von Medien

Code steht unter der MIT-Lizenz. Herkunft und Lizenzstatus von Hintergrundbild und Sounds sind in [ASSETS.md](ASSETS.md) dokumentiert.
