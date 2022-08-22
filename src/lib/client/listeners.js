const { handleCommand, handleSelect } = require('./handlers');

/**
 * Listener for interactions from discord
 * @param client
 * @param message
 * @returns {Promise<void>}
 */
const interactionComplete = async (client, message) => {
  if (message.isChatInputCommand()) {
    return handleCommand(client, message);
  }
  
  if(message.isSelectMenu()) {
    return handleSelect(client, message);
  }
}

module.exports = { interactionComplete };