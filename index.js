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

// Ana dizine yapılan isteklere yanıt olarak "Server is running" döndür
app.get('/', (req, res) => {
  res.send('Server is running');
});

async function sendMessage(chatId) {
  try {
    const response = await bot.sendMessage(chatId, `${invitationLink}`);
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Error sending message');
  }
}

app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    const chatId = update.message.chat.id;
    await sendMessage(chatId);
    res.status(200).send('Update received');
  } catch (error) {
    res.status(500).send('error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
