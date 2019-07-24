const { get } = require('../requests');

/**
 * getInboxMessagesForSectionInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/api/sections/${section}/messages/inbox`,
  });
};
