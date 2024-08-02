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

let lastMessageTime = {}; // Kullanıcıya göre son mesaj zamanı

// Kullanıcıdan /start komutunu aldığında işlem yap
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;

//   // Özel mesajda olduğundan emin ol
//   if (msg.chat.type === 'private') {
//     // Özel mesaj olarak davet linkini gönder
//     bot.sendMessage(userId, `Merhaba ${msg.from.first_name}, işte davet linki: ${invitationLink}`);
//   }
// });

// Diğer tüm mesajları ele al (eğer gerekliyse)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const now = Date.now();

  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    if (lastMessageTime[chatId] && now - lastMessageTime[chatId] < 1 * 60 * 1000) {
      // 30 dakika içinde mesaj gönderilmişse, yanıt verme
      console.log('30 dakika içinde mesaj gönderildi, yanıt verilmiyor.');
      return;
    }

    // Son mesaj zamanını güncelle
    lastMessageTime[chatId] = now;

    // Kullanıcıya özel mesaj olarak davet linkini gönderebilmek için bilgilendirme mesajı gönder
    bot.sendMessage(chatId, `Hello ${msg.chat.description}`);
  }
});

// Ana dizine yapılan isteklere yanıt olarak "Server is running" döndür
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
