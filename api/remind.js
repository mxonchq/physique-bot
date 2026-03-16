const BOT_TOKEN  = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || "https://mxonchq.github.io/fitbot-/";
const CHAT_IDS   = (process.env.CHAT_IDS || "").split(",").filter(Boolean);

const SCHEDULE = ["Верх А","Низ А","Кардио","Верх Б","Низ Б","Кардио","Отдых"];

const MESSAGES = {
  morning: () =>
    "☀️ *Доброе утро!*\n\n" +
    "📋 Не забудь:\n" +
    "• ⚖️ Взвеситься (после туалета, до еды)\n" +
    "• 💧 Выпить стакан воды\n" +
    "• 💊 Принять креатин",

  food: () =>
    "🍽 *Обед!*\n\n" +
    "Не забудь про белок — цель 200г/день\n" +
    "Записывай всё в дневник 👇",

  workout: () => {
    const wday = (new Date().getDay() + 6) % 7;
    const today = SCHEDULE[wday];
    if (wday === 6) return null;
    return `🏋️ *Время тренироваться!*\n\nСегодня: *${today}*\nОткрывай план 🔥`;
  },

  water: () =>
    "💧 *Напоминание!*\n\n" +
    "Как там с водой? Цель — 3 литра в день 👇",

  night: () =>
    "🌙 *Итоги дня*\n\n" +
    "• Белок 200г закрыт?\n" +
    "• 3л воды выпито?\n" +
    "• Креатин отмечен?\n\n" +
    "Ложись спать вовремя 💤",
};

async function sendMessage(chat_id, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{
          text: "💪 Открыть Physique",
          web_app: { url: WEBAPP_URL }
        }]]
      }
    }),
  });
}

export default async function handler(req, res) {
  const type = req.query.type;
  const msgFn = MESSAGES[type];
  if (!msgFn) return res.status(400).send("Unknown type");

  const text = msgFn();
  if (!text) return res.status(200).send("Skipped");

  for (const id of CHAT_IDS) {
    try { await sendMessage(id.trim(), text); } catch {}
  }

  res.status(200).send("OK");
}
