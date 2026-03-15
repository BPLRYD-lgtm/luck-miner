/**
 * Telegram Mini App Integration Placeholder
 *
 * This file is where you wire up the Telegram WebApp API when deploying to Telegram.
 *
 * == SETUP STEPS ==
 *
 * 1. Add the Telegram WebApp script to index.html:
 *    <script src="https://telegram.org/js/telegram-web-app.js"></script>
 *
 * 2. Uncomment and call initTelegram() from App.tsx or main.tsx:
 *    import { initTelegram } from "@/lib/telegram";
 *    initTelegram();
 *
 * 3. Replace localStorage calls in use-game-state.ts with Telegram CloudStorage:
 *    window.Telegram.WebApp.CloudStorage.setItem(key, value)
 *    window.Telegram.WebApp.CloudStorage.getItem(key, callback)
 *
 * 4. Send the initData to the backend for verification:
 *    POST /api/telegram/verify with body { initData: window.Telegram.WebApp.initData }
 *
 * Reference: https://core.telegram.org/bots/webapps
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        CloudStorage: {
          setItem: (key: string, value: string, callback?: (error: Error | null, stored: boolean) => void) => void;
          getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void;
          removeItem: (key: string, callback?: (error: Error | null, removed: boolean) => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        close: () => void;
      };
    };
  }
}

export function isTelegramContext(): boolean {
  // TODO: Use this to adapt behavior when running inside Telegram
  return typeof window !== "undefined" && !!window.Telegram?.WebApp?.initData;
}

export function initTelegram(): void {
  // TODO: Uncomment when deploying to Telegram
  // if (!isTelegramContext()) return;
  // window.Telegram!.WebApp.ready();
  // window.Telegram!.WebApp.expand();
  console.log("[Telegram] Running in local prototype mode. Telegram init skipped.");
}

export function getTelegramUser() {
  // TODO: Return actual Telegram user when in Telegram context
  // if (isTelegramContext()) {
  //   return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
  // }
  return null;
}

export function hapticTap(): void {
  // TODO: Uncomment when deploying to Telegram
  // window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
}

export function hapticSuccess(): void {
  // TODO: Uncomment when deploying to Telegram
  // window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
}

export function hapticError(): void {
  // TODO: Uncomment when deploying to Telegram
  // window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
}
