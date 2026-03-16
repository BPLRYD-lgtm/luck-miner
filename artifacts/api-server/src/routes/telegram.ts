import { Router } from "express";
import { config } from "../config";

const router = Router();

router.post("/telegram", async (req, res) => {
  try {
    console.log("Telegram update received:");
    console.log(JSON.stringify(req.body, null, 2));

    const message = req.body?.message;

    if (!message) {
      return res.sendStatus(200);
    }

    const chatId = message.chat?.id;
    const text = message.text;

    if (!chatId || !text) {
      return res.sendStatus(200);
    }

    if (text === "/start") {
      const response = await fetch(
        `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Welcome to Lucky Miner!\n\nClick below to start mining.",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play Lucky Miner",
                    web_app: {
                      url: config.webAppUrl,
                    },
                  },
                ],
              ],
            },
          }),
        },
      );

      const data = await response.text();
      console.log("Telegram sendMessage status:", response.status);
      console.log("Telegram sendMessage response:", data);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Telegram route error:", error);
    return res.sendStatus(500);
  }
});

export default router;