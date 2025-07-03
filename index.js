const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  }
});

  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('Scan deze QR met WhatsApp:');
});

client.on('ready', () => {
  console.log('✅ WhatsApp is verbonden en klaar!');
});

client.initialize();

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).send('📛 phone en message zijn verplicht');

  try {
    await client.sendMessage(phone, message);
    return res.send('✅ Bericht verzonden!');
  } catch (err) {
    console.error('❌ Fout bij verzenden:', err);
    return res.status(500).send('❌ Fout bij verzenden');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server draait op poort ${PORT}`));
