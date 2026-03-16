"""
Physique Bot — Telegram Mini App + Напоминания
pip install python-telegram-bot==20.7
"""
import os, logging, datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, JobQueue

logging.basicConfig(level=logging.INFO)
BOT_TOKEN  = os.getenv("BOT_TOKEN", "8711929320:AAGkqeMqll3t9mDDTEtmJc_5Ktd2W57Azk4")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://mxonchq.github.io/fitbot-/")
USERS = set()

def app_kb():
    return InlineKeyboardMarkup([[InlineKeyboardButton("💪 Открыть Physique", web_app=WebAppInfo(url=WEBAPP_URL))]])

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    USERS.add(update.effective_user.id)
    await update.message.reply_text(
        "👊 *Physique — Твой тренер и нутрициолог*\n\nРекомпозиция тела · 8 недель\n\nНажми кнопку ниже 👇",
        parse_mode="Markdown", reply_markup=app_kb())

async def water_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    USERS.add(update.effective_user.id)
    kb = InlineKeyboardMarkup([
        [InlineKeyboardButton("💧 200мл", callback_data="w200"), InlineKeyboardButton("💧 300мл", callback_data="w300"), InlineKeyboardButton("💧 500мл", callback_data="w500")],
        [InlineKeyboardButton("💧 750мл", callback_data="w750"), InlineKeyboardButton("💧 1 литр", callback_data="w1000")],
        [InlineKeyboardButton("📱 Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
    ])
    await update.message.reply_text("💧 Сколько воды выпил?", reply_markup=kb)

async def remind_morning(ctx):
    for uid in list(USERS):
        try: await ctx.bot.send_message(uid, "☀️ *Доброе утро!*\n\n• ⚖️ Взвесься (после туалета)\n• 💧 Выпей стакан воды\n• 💊 Прими креатин", parse_mode="Markdown", reply_markup=app_kb())
        except: pass

async def remind_food(ctx):
    for uid in list(USERS):
        try: await ctx.bot.send_message(uid, "🍽 *Обед!*\n\nНе забудь про белок — цель 200г/день\nЗаписывай в дневник 👇", parse_mode="Markdown", reply_markup=app_kb())
        except: pass

async def remind_workout(ctx):
    sch = {0:'💪 Верх А',1:'🦵 Низ А',2:'🏃 Кардио',3:'💪 Верх Б',4:'🦵 Низ Б',5:'🏃 Кардио'}
    wday = datetime.datetime.now().weekday()
    today = sch.get(wday)
    if not today: return
    for uid in list(USERS):
        try: await ctx.bot.send_message(uid, f"🏋️ *Время тренироваться!*\n\nСегодня: *{today}*\nОткрывай план 🔥", parse_mode="Markdown", reply_markup=app_kb())
        except: pass

async def remind_water(ctx):
    for uid in list(USERS):
        try: await ctx.bot.send_message(uid, "💧 *Напоминание!*\n\nКак там с водой? Цель — 3 литра 👇", parse_mode="Markdown", reply_markup=app_kb())
        except: pass

async def remind_night(ctx):
    for uid in list(USERS):
        try: await ctx.bot.send_message(uid, "🌙 *Итоги дня*\n\n• Белок 200г закрыт?\n• 3л воды выпито?\n• Креатин отмечен?\n\nЛожись спать вовремя 💤", parse_mode="Markdown", reply_markup=app_kb())
        except: pass

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("water", water_cmd))
    app.add_handler(CommandHandler("w",     water_cmd))

    from datetime import time as t
    jq: JobQueue = app.job_queue
    # UTC время (Украина UTC+3, значит -3 часа)
    jq.run_daily(remind_morning,  t(hour=6,  minute=0))   # 09:00 Киев
    jq.run_daily(remind_food,     t(hour=10, minute=0))   # 13:00
    jq.run_daily(remind_workout,  t(hour=14, minute=0))   # 17:00
    jq.run_daily(remind_water,    t(hour=16, minute=0))   # 19:00
    jq.run_daily(remind_night,    t(hour=18, minute=0))   # 21:00

    print("🚀 Physique Bot запущен!")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
