const { Client, GatewayIntentBits } = require('discord.js');
const { interactionComplete } = require('./listeners');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.on('interactionCreate', message => interactionComplete(client, message));

module.exports = client;