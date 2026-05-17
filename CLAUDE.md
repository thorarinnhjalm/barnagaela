# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

No test suite is configured.

## Environment

Firebase credentials live in `.env.local` (Vite picks these up automatically). All variables are prefixed `VITE_FIREBASE_*`. The `env.local` file (no leading dot) in the repo root is a duplicate — the canonical one is `.env.local`.

## Architecture

### Routing

Two-level nested routing via React Router:

- `/` → `Landing` (public)
- `/app/*` → `AppShell` (authenticated, enforced by `AuthGate`)
  - `/app/gratur`, `/app/svefn`, `/app/faeding` → topic pages (Crying, Sleep, Feeding)
  - `/app/anda`, `/app/dagbok`, `/app/sjalfsum` → Breathing, Diary, Self-care
  - `/app/maelar/*` → `TrackerShell` (second layout wrapper)
    - `faeding`, `svefn`, `gratur`, `voxtur`, `mynstur` → tracker pages + patterns
  - `/app/barn`, `/app/reikningur` → Baby profile, Account

Route slugs are in Icelandic throughout.

### Auth & Firebase

`AuthContext` (`src/data/AuthContext.jsx`) provides `{ user, loading }` via `useAuth()`. Auth methods (`signInWithGoogle`, `signInWithEmail`, `signUpWithEmail`, `signOut`) are exported as standalone async functions, not from the context. On first sign-in a Firestore user document is created automatically via `ensureUserDoc()`.

`AuthGate` (`src/components/AuthGate.jsx`) gates all `/app` routes — renders `null` while loading, shows an auth modal when logged out.

### Firestore Data Model

```
users/{uid}
  activeBabyId: string | null
  babies/{babyId}
    feeding/{entryId}
    sleep/{entryId}
    crying/{entryId}
    growth/{entryId}
```

Three hooks in `src/data/useTrackerData.js`:
- `useBabies()` — real-time stream of all babies for current user
- `useActiveBaby()` — reads/writes `activeBabyId` on the user doc, exposes `switchBaby()`
- `useSubcollection(babyId, name)` — generic real-time CRUD for any subcollection; returns `{ data, add, remove, update }`

### Localization

`I18nProvider` / `useI18n()` from `src/data/i18n.jsx`. Three locales: Icelandic (`is`, default), English (`en`), Polish (`pl`), stored as plain JS objects under `src/data/locales/`. The `t` object from `useI18n()` is the active locale. Language preference persisted to `localStorage` under key `barnaglaedur_lang`.

### Theme

`ThemeProvider` / `useTheme()` from `src/data/ThemeContext.jsx`. Three modes: `auto`, `light`, `dark`. Stored in `localStorage` under key `barnaglaedur-theme`. Theme is applied as classes on `document.documentElement`; colors use CSS custom properties (`--accent-primary`, `--bg-secondary`, etc.) defined in `src/index.css`.

### Static Content

Educational topic content (tips, emergency guidance) lives in `src/data/content.js`, keyed by Icelandic slug (`gratur`, `svefn`, `faeding`). Topic pages (`src/pages/TopicPage.jsx`) read from this object.

### PWA

Basic PWA setup: `public/manifest.json`, apple-touch-icon, theme-color meta tags. Vite dev server has `Cross-Origin-Opener-Policy: same-origin-allow-popups` set to enable Google OAuth popup flow.
