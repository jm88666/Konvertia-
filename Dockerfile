FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8888

CMD ["node", "index.js"]
