import { Router, type IRouter } from "express";
import healthRouter from "./health";
import telegramRouter from "./telegram";

const router: IRouter = Router();

router.use(healthRouter);

// Telegram Mini App integration endpoints (placeholder scaffold)
// TODO: Enable these when integrating with Telegram production
router.use(telegramRouter);

export default router;
