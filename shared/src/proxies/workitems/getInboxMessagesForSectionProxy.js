const { get } = require('../requests');

/**
 * getInboxMessagesForSection
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/messages/inbox`,
  });
};
