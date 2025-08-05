FROM node:18

WORKDIR /app

COPY . .

RUN npm install
RUN npm install whatsapp-web.js@1.24.0 --save --force

EXPOSE 8888

CMD ["node", "index.js"]
