require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// BotFather'dan aldığınız token
const token = process.env.TELEGRAM_BOT_TOKEN;

const invitationLink = process.env.INVITATION_LINK;

// Botu oluşturun
const bot = new TelegramBot(token);

// init express
const app = express();
app.use(bodyParser.json());

// Diğer tüm mesajları ele al (eğer gerekliyse)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `${invitationLink}`);
});

// Ana dizine yapılan isteklere yanıt olarak "Server is running" döndür
app.get('/', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

https://api.telegram.org/bot7458733472:AAE7FP7tnVgyaAuCl-pbUcBNeNHaw12c6MA/setWebhook?url=https://telegram-bot-green-tau.vercel.app/webhook

https://api.telegram.org/bot7458733472:AAE7FP7tnVgyaAuCl-pbUcBNeNHaw12c6MA/getWebhookInfo