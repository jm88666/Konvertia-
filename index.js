console.log('🟡 Bot wordt geïnitialiseerd...');

import puppeteer from 'puppeteer';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

console.log('🛠️ Puppeteer executable path:', puppeteer.executablePath());

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'planning' }),
  puppeteer: {
    executablePath: puppeteer.executablePath(),
    headless: false, // ❗️ tijdelijke debugmodus (zet later terug op true)
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authTimeoutMs: 0,
  takeoverOnConflict: true,
  syncFullHistory: true,
  usePairingCode: true
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

client.on('loading_screen', (pct, msg) => {
  console.log(`📶 Laden: ${pct}% - ${msg}`);
});

client.on('qr', () => {
  console.warn('⚠️ QR-code ontvangen (had pairing-code moeten zijn)');
});

client.initialize().then(() => {
  console.log('🚀 Client initialized');
}).catch(err => {
  console.error('💥 Fout bij initialisatie:', err);
});

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
  console.log(`🌐 Server live op http://localhost:${port}`);
});
