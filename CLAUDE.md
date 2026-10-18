# CLAUDE.md

<!-- verklag:start — sameiginleg blokk í öllum repo-um eigandans. Uppfærð miðlægt; ekki breyta hér heldur í verklag-skillinu. -->
## Verklag eigandans (gildir alltaf)

Eigandinn skrifar ekki kóða og les hann ekki. Hann stýrir á mannamáli, þú sérð um
framkvæmd, eftirlit og frásögn. Leiðbeiningarnar `verklag` og `oruggt-ship` (skills)
lýsa ferlinu í heild. Þetta eru reglurnar sem aldrei víkja, nema kaflinn "Ákvarðanir
sem gilda" neðst í þessu skjali segi annað um þetta repo:

- **Íslenska, mannamál.** Svör til eigandans, PR-lýsingar og samantektir á íslensku,
  án tæknimáls nema það skipti máli fyrir ákvörðunina. Reglur um tungumál kóða og
  skjala í repo-inu sjálfu standa óbreyttar.
- **Aldrei á main.** `main` er production. Öll vinna á sér-branch, einn afmarkaður
  hlutur á hverja branch og hvern PR.
- **Eigandinn mergear.** Opnaðu PR, bíddu eftir að allar athuganir (checks) séu
  grænar, segðu honum nákvæmlega hvað á að prófa. Smelltu aldrei sjálfur á merge.
- **Samþykktarskilyrði fyrst.** Áður en byrjað er: 1 til 3 línur um hvað notandinn á
  að geta gert þegar verkið er rétt. Það er það sem eigandinn prófar í lokin.
- **Sannreynt áður en sagt er tilbúið.** Keyrðu typecheck, lint og próf sem repo-ið
  hefur. Ef eitthvað fellur, segðu það með úttakinu, ekki "ætti að virka".
- **Sjálfstæð rýni.** Ferskur subagent, stilltur á mikla hugsun (hátt effort), les
  hvert diff eins og hann treysti ekki höfundinum, áður en PR er opnaður. Subagents
  sem aðeins leita og lesa fá litla hugsun (lágt effort).
- **Engir lyklar í samtali eða git.** Lyklar búa í umhverfisbreytum hýsingarinnar
  (Vercel, Docker, Firebase) eða í network secrets í cloud environment Claude Code.
  `.env` fer aldrei í commit. Ef lykill lekur: stopp, segja frá, leggja til endurnýjun.
- **Frávik feitletruð.** Í lokasamantekt er allt sem vék frá beiðninni eða
  samþykktarskilyrðunum feitletrað, líka ákvarðanir sem þú tókst sjálfur. Ef ekkert
  vék frá, segðu það berum orðum.
- **Ákvarðanir sem eiga að gilda áfram** fara í kaflann "Ákvarðanir sem gilda" neðst í
  þessu skjali, í sama verki og þær eru teknar.
<!-- verklag:end -->

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

`ThemeProvider` / `useTheme()` from `src/data/ThemeContext.jsx`. Three modes: `auto`, `light`, `dark`. Stored in `localStorage` under key `lulla-theme`. Theme is applied as classes on `document.documentElement`; colors use CSS custom properties (`--accent-primary`, `--bg-secondary`, etc.) defined in `src/index.css`.

### Static Content

Educational topic content (tips, emergency guidance) lives in `src/data/content.js`, keyed by Icelandic slug (`gratur`, `svefn`, `faeding`). Topic pages (`src/pages/TopicPage.jsx`) read from this object.

### PWA

Basic PWA setup: `public/manifest.json`, apple-touch-icon, theme-color meta tags. Vite dev server has `Cross-Origin-Opener-Policy: same-origin-allow-popups` set to enable Google OAuth popup flow.

## Ákvarðanir sem gilda

Ákvarðanir eigandans sem eiga að halda milli verka. Bætt við í sama verki og þær eru teknar.

- (engar skráðar enn)
