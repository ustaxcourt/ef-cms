const { get } = require('../requests');

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
exports.getInboxMessagesForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/section/${section}`,
  });
};
