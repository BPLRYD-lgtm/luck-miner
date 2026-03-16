import express from "express";

const router = express.Router();

router.post("/telegram", async (req, res) => {
  console.log("Telegram update received:");
  console.log(JSON.stringify(req.body, null, 2));

  const message = req.body?.message;

  if (!message) {
    console.log("No message found in body");
    return res.sendStatus(200);
  }

  const chatId = message.chat?.id;
  const text = message.text;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  console.log("chatId:", chatId);
  console.log("text:", text);
  console.log("token exists:", Boolean(token));

  if (text === "/start" && token && chatId) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
                  url: "https://rigid-medicably-michale.ngrok-free.dev",
                },
              },
            ],
          ],
        },
      }),
    });

    const data = await response.text();
    console.log("Telegram sendMessage status:", response.status);
    console.log("Telegram sendMessage response:", data);
  }

  res.sendStatus(200);
});

export default router;