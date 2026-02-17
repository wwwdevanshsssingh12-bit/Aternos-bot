const mineflayer = require('mineflayer');
const express = require('express');

// --- RENDER HEALTH CHECK SERVER ---
const app = express();
const port = process.env.PORT || 3000; // Render assigns a random port here

app.get('/', (req, res) => {
  res.status(200).send('Bot is Online! Ping me to keep me awake.');
});

app.listen(port, () => {
  console.log(`[WEB] Health check server listening on port ${port}`);
});

// --- MINECRAFT BOT LOGIC ---
const config = {
  host: 'Blasters.aternos.me', // Your Aternos IP
  port: 15754,                 // Your Aternos Port (Check if this changed!)
  username: 'Devansh_Bot',
  version: '1.21.1',
  auth: 'offline'
};

let bot;

function connect() {
  console.log(`[INIT] Connecting to ${config.host}:${config.port}`);

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth,
    viewDistance: 'tiny'
  });

  bot.on('login', () => console.log(`[LOGIN] ${config.username} joined.`));
  
  bot.on('spawn', () => {
    console.log('[SPAWN] Bot has spawned.');
    startAntiAfk();
  });

  bot.on('error', (err) => console.log(`[ERROR] ${err.message}`));
  
  bot.on('end', () => {
    console.log('[DISCONNECT] Reconnecting in 30s...');
    setTimeout(connect, 30000);
  });
}

function startAntiAfk() {
  setInterval(() => {
    if (bot && bot.entity) {
      bot.look(Math.random() * 6, Math.random() * 2 - 1);
    }
  }, 15000);
}

connect();
