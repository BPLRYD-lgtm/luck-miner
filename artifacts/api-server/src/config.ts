function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required but was not provided.`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  basePath: process.env.BASE_PATH ?? "/",
  telegramBotToken: requireEnv("TELEGRAM_BOT_TOKEN"),
  webAppUrl: requireEnv("WEBAPP_URL"),
};