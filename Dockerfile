FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Kopieer alle code vóór install
COPY . .

# 🔧 Installeer whatsapp-web.js@1.24.0 expliciet
RUN npm install whatsapp-web.js@1.24.0

# 📦 Installeer overige dependencies uit package.json
RUN npm install

EXPOSE 8888

CMD ["node", "index.js"]
