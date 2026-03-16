// Запусти один раз: node setup.js
// Устанавливает webhook на Vercel

const BOT_TOKEN  = "YOUR_TOKEN_HERE";
const VERCEL_URL = "physique-bot.vercel.app";

fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: `https://${VERCEL_URL}/api/webhook` }),
})
.then(r => r.json())
.then(d => console.log("Webhook set:", d))
.catch(e => console.error(e));
