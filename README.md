# Heilkräuter-App

Dies ist eine mit [Next.js](https://nextjs.org) erstellte Webanwendung zur Darstellung und Verwaltung von Heilkräutern.

## Inhaltsverzeichnis

- [Projektüberblick](#projektüberblick)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Entwicklung starten](#entwicklung-starten)
- [Projektstruktur](#projektstruktur)
- [Anpassung](#anpassung)
- [Deployment](#deployment)
- [Weiterführende Links](#weiterführende-links)

---

## Projektüberblick

Die Heilkräuter-App ist eine moderne Webanwendung, die mit Next.js entwickelt wurde. Sie dient als Basis für eine Informationsplattform rund um Heilkräuter. Das Projekt kann beliebig erweitert und angepasst werden.

## Voraussetzungen

- Node.js (empfohlen: Version 18 oder höher)
- npm (wird mit Node.js installiert)

## Installation

1. Repository klonen oder herunterladen.
2. Im Projektverzeichnis die Abhängigkeiten installieren:
   ```bash
   npm install
   ```

## Entwicklung starten

Starte den lokalen Entwicklungsserver mit:
```bash
npm run dev
```
Öffne dann [http://localhost:3000](http://localhost:3000) in deinem Browser, um die App zu sehen.

## Projektstruktur

- `app/` – Hauptverzeichnis für Seiten, Layouts und globale Einstellungen
  - `page.js` – Startseite der Anwendung
  - `layout.js` – Layout-Komponente für die gesamte App
  - `globals.css` – Globale CSS-Styles
- `public/` – Statische Dateien wie Bilder und Icons
- `styles/` – Weitere CSS-Dateien
- `package.json` – Projekt- und Abhängigkeitsverwaltung
- `next.config.mjs` – Next.js Konfiguration

## Anpassung

- Seiten können in `app/page.js` bearbeitet werden.
- Globale Styles in `app/globals.css` oder `styles/globals.css`.
- Eigene Bilder und Icons im `public/`-Ordner ablegen.

## Deployment

Die einfachste Möglichkeit zur Veröffentlichung ist [Vercel](https://vercel.com/). Alternativ kann die App auf jedem Node.js-fähigen Server deployed werden:

1. Produktionsbuild erstellen:
   ```bash
   npm run build
   ```
2. App starten:
   ```bash
   npm start
   ```

## Weiterführende Links

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Next.js Tutorial](https://nextjs.org/learn)
- [Vercel Deployment](https://vercel.com/new)
