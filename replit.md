# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Luck Miner game (mobile-first Telegram Mini App prototype) and a Node.js/Express backend scaffold.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Luck Miner Game

A bright, polished mobile-first casual risk game prototype built for Telegram Mini Apps.

### Game Rules
- 4×4 mine board (16 tiles): coins 🪙, relics 💎, multipliers ✨, traps 💥
- Player taps tiles to reveal them; can cash out before hitting a trap
- Trap hits end the run (haul lost) unless a shield absorbs them
- 8 free plays per day; extra plays cost 40 coins

### Risk System
- **Run Risk**: rises with each safe dig during a run (BASE_RISK=4.5%, +1.3% per dig, max 26%)
- **Streak Heat**: rises after successful cashouts, resets on trap hits
- When a trap fires (with or without shield): streak heat drops, next run starts easier

### State Persistence
- All game state stored in `localStorage`
- TODO: Replace with Telegram CloudStorage API in production

### Telegram Integration Notes
- `artifacts/luck-miner/src/lib/telegram.ts` — placeholder for Telegram WebApp API
- `artifacts/api-server/src/routes/telegram.ts` — backend scaffold for init-data verification and save/load endpoints
- `artifacts/luck-miner/src/App.tsx` — Telegram.WebApp.ready() commented TODO

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (Telegram backend scaffold)
│   │   └── src/routes/
│   │       ├── health.ts   # Health check
│   │       └── telegram.ts # Telegram integration placeholder routes
│   └── luck-miner/         # React + Vite game frontend
│       └── src/
│           ├── components/ # GameBoard, Tile, StatsBar, HaulDisplay, etc.
│           ├── hooks/      # use-game-state.ts, use-free-plays.ts
│           ├── pages/      # Game.tsx (main page)
│           └── lib/        # telegram.ts (Telegram API placeholder)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Running Locally

1. `pnpm install` — install all dependencies
2. Frontend dev server: runs automatically on the configured port
3. API server: runs automatically on port 8080

## Where to Add Telegram Integration Later

1. **Frontend** (`artifacts/luck-miner/src/lib/telegram.ts`):
   - Call `initTelegram()` from App.tsx
   - Replace `localStorage` calls with `Telegram.WebApp.CloudStorage`
   - Add haptic feedback on tile taps and cashout

2. **Backend** (`artifacts/api-server/src/routes/telegram.ts`):
   - `POST /api/telegram/verify` — verify Telegram initData HMAC
   - `GET /api/telegram/user/:id` — load player state from DB
   - `POST /api/telegram/save` — save player state to DB

3. **Environment Variables to Add**:
   - `TELEGRAM_BOT_TOKEN` — from @BotFather

## Hosting Notes (Telegram Production)

- **Frontend** (`luck-miner`): Deploy as a static site (Vercel, Netlify, Replit Deploy). Set the URL as your Telegram Mini App URL in @BotFather.
- **Backend** (`api-server`): Deploy as a Node.js server (Replit Deploy, Railway, Fly.io). Must be HTTPS.
- **Database**: Replit PostgreSQL (already configured via DATABASE_URL env var)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`).
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
