const WEBAPP_URL = process.env.WEBAPP_URL || "https://mxonchq.github.io/fitbot-/";
const BOT_TOKEN  = process.env.BOT_TOKEN;

async function sendMessage(chat_id, text, reply_markup) {
  const body = { chat_id, text, parse_mode: "Markdown" };
  if (reply_markup) body.reply_markup = reply_markup;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function appKeyboard() {
  return {
    inline_keyboard: [[{
      text: "💪 Открыть Physique",
      web_app: { url: WEBAPP_URL }
    }]]
  };
}

function waterKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "💧 200 мл", callback_data: "w200" },
        { text: "💧 300 мл", callback_data: "w300" },
        { text: "💧 500 мл", callback_data: "w500" },
      ],
      [
        { text: "💧 750 мл", callback_data: "w750" },
        { text: "💧 1 литр",  callback_data: "w1000" },
      ],
      [{ text: "📱 Открыть приложение", web_app: { url: WEBAPP_URL } }]
    ]
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK");

  const update = req.body;

  // Обычные сообщения
  if (update.message) {
    const msg  = update.message;
    const chat = msg.chat.id;
    const text = msg.text || "";

    if (text === "/start" || text.startsWith("/start")) {
      await sendMessage(chat,
        "👊 *Physique — Твой тренер и нутрициолог*\n\n" +
        "Рекомпозиция тела · 8 недель\n" +
        "Верх/Низ 4× · Кардио 2× · Питание с дефицитом\n\n" +
        "Нажми кнопку ниже 👇",
        appKeyboard()
      );
    }

    else if (text === "/water" || text === "/w") {
      await sendMessage(chat, "💧 Сколько воды выпил?", waterKeyboard());
    }

    else if (text === "/open") {
      await sendMessage(chat, "Открывай 💪", appKeyboard());
    }

    else {
      await sendMessage(chat, "Привет! Нажми кнопку чтобы открыть приложение 👇", appKeyboard());
    }
  }

  // Нажатие кнопок
  if (update.callback_query) {
    const cq   = update.callback_query;
    const chat = cq.message.chat.id;
    const data = cq.data;

    const waterMap = { w200: 200, w300: 300, w500: 500, w750: 750, w1000: 1000 };
    if (waterMap[data]) {
      await sendMessage(chat,
        `✅ +${waterMap[data]} мл записано!\n\nОткрой приложение чтобы проверить прогресс 👇`,
        appKeyboard()
      );
    }

    // Ответить на callback чтобы убрать часики
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: cq.id }),
    });
  }

  res.status(200).send("OK");
}
