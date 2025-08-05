import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'planning' }),
  authTimeoutMs: 0,
  takeoverOnConflict: true,
  syncFullHistory: true,
  usePairingCode: true, // 🔑 Belangrijk: koppelcode ipv QR
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});


client.on('pairing-code', code => {
  console.log(`🔗 Koppelcode: ${code}`);
  console.log('➡️ Ga op je telefoon naar WhatsApp > Instellingen > Gekoppelde apparaten > Apparaat koppelen');
});

client.on('ready', () => {
  console.log('✅ Bot is klaar en gekoppeld aan WhatsApp!');
});

client.initialize();

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const chatId = phone.includes('@') ? phone : `${phone}@c.us`;
    await client.sendMessage(chatId, message);
    console.log(`✅ Bericht verzonden naar ${chatId}`);
    res.status(200).send('Bericht verzonden');
  } catch (err) {
    console.error('❌ Fout bij verzenden:', err);
    res.status(500).send('Fout bij verzenden');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server live op http://localhost:${port}`);
});
