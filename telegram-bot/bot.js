require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

/* ---------- Config ---------- */
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN muhit o'zgaruvchisi topilmadi!");
  process.exit(1);
}
if (!WEB_APP_URL) {
  console.error("WEB_APP_URL muhit o'zgaruvchisi topilmadi!");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ---------- Xatoliklarni ushlash ---------- */
bot.on("polling_error", (err) => {
  console.error("❌ Polling xatosi:", err.code, err.message);
});

bot.on("error", (err) => {
  console.error("❌ Bot xatosi:", err.message);
});

/* ---------- /start ---------- */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || "Foydalanuvchi";

  bot.sendMessage(
    chatId,
    `Assalomu alaykum, ${firstName}! 👋\n\nCyberTest platformasiga xush kelibsiz.\nQuyidagi tugmani bosib testlarni boshlashingiz mumkin.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📝 Testni boshlash",
              web_app: { url: WEB_APP_URL },
            },
          ],
        ],
      },
    }
  );
});

/* ---------- /help ---------- */
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🤖 CyberTest Bot buyruqlari:\n\n/start - Botni ishga tushirish\n/test - Testni ochish\n/help - Yordam`
  );
});

/* ---------- /test ---------- */
bot.onText(/\/test/, (msg) => {
  bot.sendMessage(msg.chat.id, "Testni boshlash uchun quyidagi tugmani bosing:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📝 Testni ochish",
            web_app: { url: WEB_APP_URL },
          },
        ],
      ],
    },
  });
});

console.log("✅ CyberTest bot ishga tushdi!");
