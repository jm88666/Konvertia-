const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
app.use(express.json());

// 👉 Gebruik lokale sessie-opslag uit je projectmap
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session',      // Zorg dat ./session/Default in je repo staat
    clientId: 'railway'         // voorkomt dubbele paden zoals ./session/session
  })
});

client.on('qr', (qr) => {
  console.log('📱 Scan deze QR met WhatsApp:');
  qrcode.generate(qr, { small: true });
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

// 📨 Webhook om berichten te ontvangen vanaf bijvoorbeeld Google Sheets
app.post('/send', async (req, res) => {
  const { message, phone } = req.body;

  if (!message || !phone) {
    return res.status(400).send('Fout: message en phone zijn verplicht');
  }

  try {
    const chatId = phone.includes('@g.us') ? phone : `31${phone.replace(/^0/, '')}@c.us`;
    const chat = await client.getChatById(chatId);
    await chat.sendMessage(message);
    res.send('✅ Bericht verzonden!');
  } catch (error) {
    console.error('❌ Fout bij verzenden:', error);
    res.status(500).send('Fout bij verzenden');
  }
});

// 🌐 Start de Express-server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Webhook actief op http://localhost:${port}/send`);
});
