import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

/**
 * POST /api/telegram/verify
 *
 * TODO: Implement Telegram Mini App init-data verification here.
 *
 * When integrating with Telegram:
 * 1. Receive the `initData` string from the Telegram WebApp frontend
 * 2. Verify it using HMAC-SHA256 with your bot token as the key
 * 3. Parse the verified data to extract user info (id, username, etc.)
 * 4. Return a session token (JWT) for subsequent API calls
 *
 * Reference: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * Required env vars:
 *   TELEGRAM_BOT_TOKEN - Your bot token from @BotFather
 */
router.post("/telegram/verify", (req: Request, res: Response) => {
  // TODO: Parse req.body.initData
  // TODO: Verify HMAC signature against TELEGRAM_BOT_TOKEN
  // TODO: Extract user from verified data
  // TODO: Create or find user in DB, return session token

  res.json({
    ok: false,
    message: "Telegram init-data verification not yet implemented",
    // TODO: Remove this stub when implementing real verification
  });
});

/**
 * GET /api/telegram/user/:telegramId
 *
 * TODO: Fetch user game state from database.
 *
 * When implementing:
 * 1. Authenticate the request with the session token from /telegram/verify
 * 2. Query the users table for this Telegram user
 * 3. Return coins, relics, shields, bestScore, freePlays, etc.
 *
 * This replaces localStorage-based state in the frontend.
 */
router.get("/telegram/user/:telegramId", (req: Request, res: Response) => {
  const { telegramId } = req.params;

  // TODO: Authenticate request
  // TODO: Query DB for user state
  // TODO: Return actual user data

  res.json({
    ok: false,
    telegramId,
    message: "User state persistence not yet implemented",
  });
});

/**
 * POST /api/telegram/save
 *
 * TODO: Save user game state to database.
 *
 * When implementing:
 * 1. Authenticate the request
 * 2. Validate the game state payload
 * 3. Save coins, relics, shields, bestScore, freePlays, nextReset to DB
 *
 * Frontend currently uses localStorage — swap calls to use this endpoint instead.
 */
router.post("/telegram/save", (req: Request, res: Response) => {
  // TODO: Authenticate request
  // TODO: Validate body: { telegramId, coins, relics, shields, bestScore, freePlaysUsed, nextReset }
  // TODO: Upsert into users table

  res.json({
    ok: false,
    message: "Game state save not yet implemented",
  });
});

/**
 * POST /api/telegram/leaderboard
 *
 * TODO: Get top scores leaderboard.
 * Consider using Telegram's built-in game scores API for leaderboards.
 */
router.get("/telegram/leaderboard", (_req: Request, res: Response) => {
  // TODO: Query top 10 users by bestScore from DB

  res.json({
    ok: false,
    leaderboard: [],
    message: "Leaderboard not yet implemented",
  });
});

export default router;
