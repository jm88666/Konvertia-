const express = require('express');
const { Client } = require('whatsapp-web.js');
const { useRemoteAuth, RemoteAuthConfig } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL; // Voeg deze toe bij Railway → Variables

mongoose.connect(mongoUrl).then(() => {
  const store = new MongoStore({ mongoose });

  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000
    })
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp is verbonden en klaar!');
  });

  client.on('message', msg => {
    console.log('📩 Bericht ontvangen:', msg.body);
  });

  client.initialize();

  app.post('/send', async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).send('❌ Vereist: phone & message');
    }

    try {
      const chatId = phone.includes('@g.us') ? phone : `31${phone.replace(/^0/, '')}@c.us`;
      await client.sendMessage(chatId, message);
      res.send('✅ Bericht verzonden!');
    } catch (error) {
      console.error('❌ Fout bij verzenden:', error);
      res.status(500).send('❌ Verzendfout');
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
  });
});
