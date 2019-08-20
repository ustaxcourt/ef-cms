const { get } = require('../requests');

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the inbox messages
 * @returns {Promise<*>} the promise of the api call
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
