import { Client, LocalAuth } from 'whatsapp-web.js';
import express from 'express';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'planning' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

client.on('qr', qr => {
  console.log('🔐 Scan de QR-code hieronder:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp-bot is klaar!');
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
  console.log(`🚀 Server draait op http://localhost:${port}`);
});
