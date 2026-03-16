// Запусти один раз: node setup.js
// Устанавливает webhook на Vercel

const BOT_TOKEN   = "8711929320:AAGkqeMqll3t9mDDTEtmJc_5Ktd2W57Azk4";       // ← вставь токен
const VERCEL_URL  = "physique-bot.vercel.app";       // ← вставь домен с Vercel (например: physique-bot.vercel.app)

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: `https://${VERCEL_URL}/api/webhook` }),
})
.then(r => r.json())
.then(d => console.log("Webhook set:", d))
.catch(e => console.error(e));
