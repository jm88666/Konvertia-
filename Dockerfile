FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package*.json ./

# 🔧 Forceer juiste versie van whatsapp-web.js
RUN npm install whatsapp-web.js@1.24.0

# 📦 Installeer overige dependencies
RUN npm install

COPY . .

EXPOSE 8888

CMD ["node", "index.js"]
