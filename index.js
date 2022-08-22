const { SlashCommandBuilder, Routes } = require('discord.js');
const dotenv = require('dotenv');
const t = require('./messages.json');

dotenv.config();

const client = require('./src/lib/client');

client
  .login(process.env.TOKEN)
  .then(async () => {
    const guilds = await client.guilds.fetch(process.env.GUILD_ID);
    const channels = await guilds.channels.fetch();
    
    const commands = [
      new SlashCommandBuilder()
        .setName(t['app.command.name'])
        .setDescription(t['app.command.description'])
        .addStringOption(option => 
          option
            .setName(t['app.command.input.name'])
            .setDescription(t['app.command.input.description'])
            .setRequired(true)
        )
    ].map(cm => cm.toJSON());
    
    await client.rest.put(
      Routes.applicationCommands(client.application.id, process.env.GUILD_ID),
      { body: commands }
    );
    
    client.filmChannels = channels
      .filter(({ name }) => name.match(/Кинозал №\d/))
      .sort((ch1, ch2) => ch1.rawPosition - ch2.rawPosition);
    
    client.announceChannel = await client.channels.fetch(process.env.ANNOUNCE_CHANNEL_ID);
  });
