const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentMessagesForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/messages/sent`,
  });
};
