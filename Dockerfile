FROM node:18

WORKDIR /app
COPY . .

# Verwijder oude versie en installeer de juiste versie van whatsapp-web.js
RUN npm uninstall whatsapp-web.js && npm install whatsapp-web.js@1.24.0

RUN npm install
EXPOSE 8888
CMD ["node", "index.js"]
