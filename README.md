# Luck Miner

A bright, polished mobile-first casual risk game built as a Telegram Mini App prototype.
Tap tiles on a 4×4 mine board to collect coins, relics, and multipliers — cash out before hitting a trap.

---

## Project Structure

```
luck-miner/
│
├── artifacts/
│   ├── luck-miner/          ← FRONTEND (React + Vite + TypeScript + Tailwind + Framer Motion)
│   │   ├── src/
│   │   │   ├── components/  ← GameBoard, Tile, StatsBar, HaulDisplay, BottomDrawer, etc.
│   │   │   ├── hooks/       ← Game logic (use-game-state.ts, use-free-plays.ts)
│   │   │   ├── pages/       ← Game.tsx (main page)
│   │   │   └── lib/         ← telegram.ts (Telegram API placeholder)
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   └── api-server/          ← BACKEND (Node.js + Express scaffold)
│       └── src/
│           ├── routes/
│           │   ├── health.ts    ← GET /api/healthz
│           │   └── telegram.ts  ← Telegram integration placeholders (TODO)
│           ├── app.ts
│           └── index.ts
│
├── lib/
│   ├── api-spec/            ← OpenAPI spec + Orval codegen config
│   ├── api-client-react/    ← Generated React Query hooks
│   ├── api-zod/             ← Generated Zod validation schemas
│   └── db/                  ← Drizzle ORM schema + PostgreSQL connection
│
├── package.json             ← Root workspace scripts
├── pnpm-workspace.yaml      ← pnpm workspace + dependency catalog
├── tsconfig.json            ← TypeScript project references
└── .env.example             ← Required environment variables
```

---

## Requirements

- **Node.js** v20 or later — install via [nodejs.org](https://nodejs.org) or `brew install node`
- **pnpm** v9 or later — install via `npm install -g pnpm`

Verify you have both:
```bash
node --version    # should be v20+
pnpm --version    # should be v9+
```

---

## Quick Start (Mac)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/luck-miner.git
cd luck-miner
```

### 2. Install all dependencies

```bash
pnpm install
```

This installs dependencies for every package in the monorepo in one step.

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values (see [Environment Variables](#environment-variables) below).
For a frontend-only local run without a database, the `DATABASE_URL` can be skipped — the frontend stores everything in `localStorage`.

### 4. Run the frontend (game)

```bash
pnpm --filter @workspace/luck-miner run dev
```

Open **http://localhost:5173** in your browser. The game is immediately playable — no backend required.

### 5. Run the backend API server (optional for prototype)

In a second terminal:

```bash
pnpm --filter @workspace/api-server run dev
```

The API server starts on the port defined in your `.env` (default `8080`).
Health check: **http://localhost:8080/api/healthz**

---

## All Available Commands

### Install

```bash
pnpm install                            # Install all workspace dependencies
```

### Frontend (game)

```bash
pnpm --filter @workspace/luck-miner run dev       # Start Vite dev server
pnpm --filter @workspace/luck-miner run build     # Build for production (outputs to dist/)
pnpm --filter @workspace/luck-miner run serve     # Preview the production build locally
pnpm --filter @workspace/luck-miner run typecheck # TypeScript check (frontend only)
```

### Backend (API server)

```bash
pnpm --filter @workspace/api-server run dev       # Start Express dev server (uses tsx)
pnpm --filter @workspace/api-server run build     # Bundle for production (outputs to dist/)
pnpm --filter @workspace/api-server run typecheck # TypeScript check (backend only)
```

### Workspace-wide

```bash
pnpm run typecheck                      # TypeScript check for the entire monorepo
pnpm run build                          # Typecheck + build all packages
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable            | Required for | Description |
|---------------------|-------------|-------------|
| `PORT`              | Backend      | Port for the Express server (default: `8080`) |
| `DATABASE_URL`      | Backend      | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN`| Telegram integration | Your bot token from @BotFather (not needed for local prototype) |

The **frontend requires no environment variables** — it runs entirely in the browser and stores state in `localStorage`.

---

## Gameplay

| Element | Description |
|---------|-------------|
| 🪙 Coin tile | Adds coins to your current haul |
| 💎 Relic tile | Adds a relic to your permanent balance |
| ✨ Multiplier tile | Increases the payout multiplier for the run |
| 💥 Trap tile | Ends your run and loses the haul (unless a shield absorbs it) |

**Risk System:**
- Every safe dig increases run risk by 1.3% (starts at 4.5%, max 26%)
- Winning cash-outs increase "streak heat" — future runs start slightly riskier
- Hitting a trap (with or without a shield) reduces streak heat and resets the baseline risk

**Free Plays:** 8 free plays per day. Extra plays cost 40 coins. Resets daily.

**Shields:** Buy shields from the ⚙️ menu (80 coins each). A shield absorbs one trap.

---

## Telegram Mini App Integration (TODO)

This is a local prototype. To deploy as a real Telegram Mini App:

### Frontend
1. Add the Telegram script to `artifacts/luck-miner/index.html`:
   ```html
   <script src="https://telegram.org/js/telegram-web-app.js"></script>
   ```
2. Call `initTelegram()` in `artifacts/luck-miner/src/App.tsx` (see the TODO comments there)
3. Replace `localStorage` calls in `use-game-state.ts` with `Telegram.WebApp.CloudStorage`
4. Enable haptic feedback from `artifacts/luck-miner/src/lib/telegram.ts`

### Backend
All Telegram backend endpoints are scaffolded in `artifacts/api-server/src/routes/telegram.ts`:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/telegram/verify` | Verify Telegram `initData` HMAC with your bot token |
| `GET /api/telegram/user/:id` | Load player state from the database |
| `POST /api/telegram/save` | Save player state to the database |
| `GET /api/telegram/leaderboard` | Top scores leaderboard |

Add your `TELEGRAM_BOT_TOKEN` to `.env` and implement each route handler.

### Hosting (Production)
- **Frontend:** Deploy `artifacts/luck-miner/` as a static site (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Set the HTTPS URL as your Mini App URL in @BotFather settings.
- **Backend:** Deploy `artifacts/api-server/` as a Node.js server (Railway, Fly.io, Render). Must be HTTPS.
- **Database:** PostgreSQL — provision from your hosting provider and set `DATABASE_URL`.

---

## Tech Stack

**Frontend (`artifacts/luck-miner/`)**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion (animations)
- canvas-confetti (cashout celebration)
- Lucide React (icons)
- Wouter (routing)

**Backend (`artifacts/api-server/`)**
- Node.js + Express 5 + TypeScript
- Drizzle ORM + PostgreSQL
- Zod validation (generated from OpenAPI spec)

**Tooling**
- pnpm workspaces (monorepo)
- Orval (OpenAPI → TypeScript codegen)
- tsx (TypeScript execution for dev)
- esbuild (production backend bundle)
