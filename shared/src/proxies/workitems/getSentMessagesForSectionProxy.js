const { get } = require('../requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the sent messages
 * @returns {Promise<*>} the promise of the api call
 */
exports.getSentMessagesForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/messages/sent`,
  });
};
