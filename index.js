const express = require('express');
const { Client } = require('whatsapp-web.js');
const { useMobileWithPhoneNumber } = require('whatsapp-web.js/strategies/auth');

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: useMobileWithPhoneNumber({
    phoneNumber: '31629189050', // vervang door jouw nummer zonder 0, met 31
    registration: {
      enabled: true,
      waitForCode: async (code) => {
        console.log('\n🔐 KOPPELCODE ONTVANGEN!');
        console.log('➡️ Voer deze code in via WhatsApp op je telefoon:');
        console.log(`\n🟢 ${code}\n`);
      }
    }
  })
});

client.on('ready', () => {
  console.log('✅ WhatsApp is verbonden en klaar!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authenticatiefout:', msg);
});

client.on('disconnected', (reason) => {
  console.log('🔌 Verbinding verbroken:', reason);
});

client.initialize();

app.post('/send', async (req, res) => {
  const { message, phone } = req.body;

  if (!message || !phone) {
    return res.status(400).send('Fout: message en phone zijn verplicht');
  }

  const chatId = phone.includes('@g.us')
    ? phone
    : `31${phone.replace(/^0/, '')}@c.us`;

  try {
    if (!client.info || !client.info.wid) {
      return res.status(503).send('WhatsApp client is nog niet klaar');
    }

    await client.sendMessage(chatId, message);
    res.send('✅ Bericht verzonden!');
  } catch (error) {
    res.status(500).send('Fout bij verzenden');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Webhook actief op http://localhost:${port}/send`);
});
