const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentMessagesForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/api/sections/${section}/messages/sent`,
  });
};
