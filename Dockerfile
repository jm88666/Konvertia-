FROM node:18

RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm-dev \
  libdrm2 \
  libasound2 \
  libxshmfence1 \
  libgtk-3-0 \
  libxss1 \
  libxext6 \
  libxfixes3 \
  libpci3 \
  xdg-utils \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
