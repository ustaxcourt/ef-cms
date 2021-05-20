const { get } = require('../requests');

/**
 * getOutboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
exports.getOutboxMessagesForSectionInteractor = (
  applicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/section/${section}`,
  });
};
