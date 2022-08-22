const { getFilmsByName, getFilmInfo } = require('../api/films');
const { createFilmOptions, createPreview, createChannelLink } = require('../../helpers');
const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const genres = require('../../../genres.json');
const t = require('../../../messages.json');

/**
 * Handler for slash commands from chat
 * @param client
 * @param message
 * @returns {Promise<void>}
 */
const handleCommand = async (client, message) => {
  switch (message.commandName) {
    case t['app.command.name']:
      const value = message.options.getString(t['app.command.input.name']);

      const films = await getFilmsByName(value);

      if (!films.length) {
        message.reply({ content: t['app.error.not_found'], ephemeral: true });

        return;
      }

      const options = createFilmOptions(films);

      const row =  new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('select-film')
            .setPlaceholder(t['app.select.film'])
            .addOptions(options)
        );

      message.reply({ components: [row], ephemeral: true });

      break;
  }
};

/**
 * Handler for select choices
 * @param client
 * @param message
 * @returns {Promise<void>}
 */
const handleSelect = async (client, message) => {
  const [filmId, channelId] = message.values[0].split('_');

  switch (message.customId) {
    case 'select-film':
      const row = new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('select-place')
            .setPlaceholder(t['app.select.place'])
            .addOptions(client.filmChannels.map(({ name, id }) => ({
              label: name,
              value: `${filmId}_${id}`,
            })))
        );

      message.reply({ components: [row], ephemeral: true });

      break;
    case 'select-place':
      const channel = client.filmChannels.get(channelId);

      if (!channel) return;

      const film = await getFilmInfo(filmId);

      if (!film) return;

      const preview = createPreview(film, message.user, channel);
      
      const content = `${film.genres
        .filter(({ genre }) => !!genres[genre])
        .map(({ genre }) => `<@&${genres[genre]}>`)
        .join(', ')}\n${t['app.announce.started']}`;

      const embed = new EmbedBuilder()
        .setColor('#ffc757')
        .setTitle(film.name)
        .setDescription(preview)
        .setImage(film.posterUrl);
      
      const btnRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel(t['app.announce.join'])
            .setStyle(ButtonStyle.Link)
            .setURL(createChannelLink(channel))
        );
      
      await client.announceChannel.send({ content, embeds: [embed], components: [btnRow] });
      
      message.reply({ content: t['app.announce.success'], ephemeral: true });

      break;
  }
};

module.exports = { handleSelect, handleCommand };