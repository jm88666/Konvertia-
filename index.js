import puppeteer from 'puppeteer';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'planning' }),
  puppeteer: {
    executablePath: puppeteer.executablePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authTimeoutMs: 0,
  takeoverOnConflict: true,
  syncFullHistory: true,
  usePairingCode: true, // ✅ hierdoor krijg je een koppeling via code (geen QR)
});

client.on('pairing-code', (code) => {
  console.log(`🔗 Koppelcode: ${code}`);
  console.log('➡️ Voer deze code in op je telefoon via:');
  console.log('   WhatsApp > Instellingen > Gekoppelde apparaten > Apparaat koppelen > Code invoeren');
});

client.on('ready', () => {
  console.log('✅ Bot is klaar en gekoppeld aan WhatsApp!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Auth mislukt:', msg);
});

client.on('disconnected', (reason) => {
  console.warn('📴 Bot is losgekoppeld:', reason);
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
