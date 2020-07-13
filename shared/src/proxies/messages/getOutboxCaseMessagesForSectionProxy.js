const { get } = require('../requests');

/**
 * getOutboxCaseMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOutboxCaseMessagesForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/section/${section}`,
  });
};
