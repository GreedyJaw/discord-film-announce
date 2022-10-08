const t = require('../messages.json');

/**
 * Returns conversion minutes to hh:mm string
 * @param mins
 * @returns {string}
 */
const getDurationByMinutes = (mins) => {
  const h = parseInt(mins / 60);
  const m = mins - (h * 60);

  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
}

/**
 * Returns discord link to channel
 * @param guildId
 * @param id
 * @returns {`https://discord.com/channels/${string}/${string}`}
 */
const createChannelLink = ({ guildId, id }) =>
  `https://discord.com/channels/${guildId}/${id}`;

/**
 * Returns film options for select
 * @param items
 * @returns {{label: string, value: *}[]}
 */
const createFilmOptions = (items = []) =>
  items.map(({ kinopoiskId, nameRu, nameEn, nameOriginal, year }) => ({
    label: `${nameRu || nameEn || nameOriginal} (${year})`,
    value: kinopoiskId.toString(),
  }));

/**
 * Returns preview content for discord
 * @param film
 * @param user
 * @param channel
 * @returns {string}
 */
const createPreview = (film, user, channel) => {
  const channelLink = createChannelLink(channel);

  let content = '';

  if (film.description) {
    content += `**${t['app.announce.description']}** *: ${film.description}*\n\n`;
  }

  if (film?.genres.length > 0) {
    content += `**${t['app.announce.genres']}** *: ${film.genres.map(({ genre }) => genre).join(', ')}*\n`;
  }

  if (film.filmLength) {
    const duration = getDurationByMinutes(film.filmLength);

    content += `**${t['app.announce.duration']}** *: ${film.filmLength} мин. / ${duration}*\n`;
  }

  content += `**${t['app.announce.more']}** : [*${t['app.announce.more.link']}*](${film.webUrl})\n`;

  content += `**${t[`app.announce.ratingKinopoisk`]}:** *${film.ratingKinopoisk} / 10*\n`

  content += `**${t[`app.announce.ratingImdb`]}:** *${film.ratingImdb} / 10*\n\n`

  content += `**${t['app.announce.view']}** : [*${channel.name}*](${channelLink})\n`;

  content += `**${t['app.announce.creator']}** : *<@${user.id}>*\n\n`;

  return content;
}

module.exports = { getDurationByMinutes, createChannelLink, createFilmOptions, createPreview };