import puppeteer from 'puppeteer';
import pkg from 'whatsapp-web.js';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

const { Client, LocalAuth } = pkg;

dotenv.config();
const app = express();
app.use(express.json());

console.log('🟡 Initialiseren bot...');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'planning' }),
  authTimeoutMs: 0,
  takeoverOnConflict: true,
  syncFullHistory: true,
  usePairingCode: true,
  puppeteer: {
    executablePath: puppeteer.executablePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Pairing-code
client.on('qr', (qr) => {
  console.log('📱 QR-code ontvangen, scan deze met WhatsApp!');
  fs.writeFileSync('./last_qr.txt', qr); // optioneel voor debug
});

client.on('pairing-code', code => {
  console.log(`🔗 Koppelcode: ${code}`);
  console.log('➡️ Ga op je telefoon naar WhatsApp > Instellingen > Gekoppelde apparaten > Apparaat koppelen > Code invoeren');
});

// Klaar
client.on('ready', () => {
  console.log('✅ Bot is klaar en gekoppeld aan WhatsApp!');
});

// Fout
client.on('auth_failure', msg => {
  console.error('❌ Authenticatie mislukt:', msg);
});

client.on('disconnected', (reason) => {
  console.warn('⚠️ Verbinding verbroken:', reason);
});

// Start
client.initialize().catch(err => {
  console.error('❌ Fout bij initialisatie:', err);
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server live op http://localhost:${port}`);
});
