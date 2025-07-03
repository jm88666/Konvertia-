const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Scan deze QR met WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp is verbonden en klaar!');
});

const startClient = async () => {
  await client.initialize();
};

startClient();

app.post('/send', async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) return res.status(400).send('phone en message zijn verplicht');
    try {
        await client.sendMessage(phone, message);
        return res.send('✅ Bericht verzonden');
    } catch (err) {
        console.error('❌ Fout bij verzenden:', err);
        return res.status(500).send('❌ Fout bij verzenden');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server draait op poort ${PORT}`);
});
