# Real-Time Clock (Assignment 2)

A compact React + Vite project demonstrating multiple clock components: digital, analog, world clock, and a simple alarm system. The app focuses on clean component design, responsive UI, and smooth real-time updates.

**Author:** Varad Khedkar — TY CS N-53

## Overview
- Real-time digital clock (local time)
- Analog clock with smooth motion
- World clock showing multiple time zones
- Simple alarm component (browser notifications / audio)

## Tech Stack
- React (JSX)
- Vite (fast dev server and build)
- Plain CSS for styling

## Important Files
- `index.html` — Vite HTML entry
- `package.json` — scripts and dependencies
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — main application container
- `src/components/` — `AnalogClock.jsx`, `DigitalClock.jsx`, `WorldClock.jsx`, `AlarmSystem.jsx`

## Setup & Run
1. Install Node.js (recommended v16+).
2. From the project root run:

```bash
npm install
npm run dev
```

3. Open the local dev URL printed by Vite (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Notes & Tips
- The app uses the browser clock; network time sync is not required for demonstrations.
- Extend `AlarmSystem.jsx` to persist alarms in localStorage or integrate audio files.

---
If you'd like, I can add a Dockerfile for consistent local development or wire up a small CI workflow for automatic builds.
