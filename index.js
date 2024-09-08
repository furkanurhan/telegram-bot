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

async function isAdmin(chatId, userId) {
  try {
    const administrators = await bot.getChatAdministrators(chatId);
    return administrators.some(admin => admin.user.id === userId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

async function sendMessage(chatId) {
  try {
    const response = await bot.sendMessage(chatId, `Daha Fazla Bilgi İçin ⬇️`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📎 FORUM GİRİŞ',
              url: invitationLink
            }
          ]
        ]
      },
      parse_mode: 'HTML'
    });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Error sending message');
  }
}

app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    if (!update.hasOwnProperty('message')) {
      res.status(200).send('message does not exist');
      return
    }
    
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const messageId = update.message.message_id;

    console.info('USER: ', update.message.from?.id, update.message.from?.first_name)

    // Botun mesajlarını geç
    // if (userId === 1087968824) {
    //   res.status(200).send('Bot message ignored');
    //   return;
    // }

    const isUserAdmin = await isAdmin(chatId, userId);

    if (!isUserAdmin) {
      // Mesajı sil
      await bot.deleteMessage(chatId, messageId);
    } else {
      // Eğer kullanıcı adminse, bilgilendirme mesajını gönder
      await sendMessage(chatId);
    }

    res.status(200).send('Update received');
  } catch (error) {
    res.status(500).send('error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
