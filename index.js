require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// BotFather'dan aldığınız token
const token = process.env.TELEGRAM_BOT_TOKEN;

const invitationLink = process.env.INVITATION_LINK;

// Botu oluşturun
const bot = new TelegramBot(token, { polling: true });

// init express
const app = express();
app.use(bodyParser.json());

// Kullanıcıları saklamak için bir dizi
const users = [];

// Yeni mesaj geldiğinde
// bot.on('message', (msg) => {
//     console.log(msg)
//     const chatId = msg.chat.id;
//     const userId = msg.from.id;
//     const username = msg.from.username;

//     // Kullanıcıyı kaydet
//     if (!users.some(user => user.id === userId)) {
//         users.push({
//             id: userId,
//             username: username,
//             firstName: msg.from.first_name,
//             lastName: msg.from.last_name
//         });
//         console.log(`Yeni kullanıcı eklendi: ${username}`);
//     }

//     // Kullanıcıya davet gönder
//     bot.sendMessage(userId, `Merhaba ${msg.from.first_name}, şu gruba katılmak ister misiniz? ${yourGroupInviteLink}`);
// });

// davet linkini aynı gruptan atıyor
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
  
//     // Sadece grup sohbetlerinde mesajı işleyelim
//     if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
//       // Mesajı gönderen kullanıcıya davet linkini gönder
//       bot.sendMessage(chatId, `Merhaba ${msg.from.first_name}, işte davet linki: ${invitationLink}`);
//     }
// });

// bu hata alıyor çünkü kullanıcı etkileşime girmeden yaparsan telegram bloklar.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const userId = msg.from.id;

//   // Sadece grup sohbetlerinde mesajı işleyelim
//   if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
//     // Kullanıcıya özel mesaj olarak davet linkini gönder
//     bot.sendMessage(userId, `Merhaba ${msg.from.first_name}, işte davet linki: ${invitationLink}`);
//   }
// });

// Kullanıcıdan /start komutunu aldığında işlem yap
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Özel mesajda olduğundan emin ol
  if (msg.chat.type === 'private') {
    // Özel mesaj olarak davet linkini gönder
    bot.sendMessage(userId, `Merhaba ${msg.from.first_name}, işte davet linki: ${invitationLink}`);
  }
});

// Diğer tüm mesajları ele al (eğer gerekliyse)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Sadece grup sohbetlerinde mesajı işleyelim
  if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
    // Kullanıcıya özel mesaj olarak davet linkini gönderebilmek için bilgilendirme mesajı gönder
    bot.sendMessage(chatId, invitationLink);
  }
});

// Ana dizine yapılan isteklere yanıt olarak "Server is running" döndür
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post(`/webhook/${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
