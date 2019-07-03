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
    endpoint: `/sections/${section}/messages/inbox`,
  });
};
