const { Client, useMobileWithPhoneNumber } = require('whatsapp-web.js');
const express = require('express');

const app = express();
app.use(express.json());

// ✅ Vervang dit door je eigen 31-nummer zonder 0
const phoneNumber = '31629189050';

const client = new Client({
  authStrategy: useMobileWithPhoneNumber({
    phoneNumber,
    registration: {
      enabled: true,
      waitForCode: async () => {
        console.log('📱 Open WhatsApp op je telefoon > Gekoppelde apparaten > “Heb je geen QR-code?”');
        console.log('✏️ Voer daar de 8-cijferige koppelcode in om te koppelen.');
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
    console.log('❌ Ontbrekende parameters:', req.body);
    return res.status(400).send('Fout: message en phone zijn verplicht');
  }

  const chatId = phone.includes('@g.us')
    ? phone
    : `31${phone.replace(/^0/, '')}@c.us`;

  try {
    if (!client.info || !client.info.wid) {
      console.warn('📴 Client nog niet klaar om berichten te verzenden');
      return res.status(503).send('WhatsApp client is nog niet klaar');
    }

    console.log(`📤 Bericht wordt verzonden naar ${chatId}: "${message}"`);
    await client.sendMessage(chatId, message);

    console.log('✅ Bericht succesvol verzonden!');
    res.send('✅ Bericht verzonden!');
  } catch (error) {
    console.error('❌ VERZEND FOUT:', error);
    res.status(500).send('Fout bij verzenden');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Webhook actief op http://localhost:${port}/send`);
});
