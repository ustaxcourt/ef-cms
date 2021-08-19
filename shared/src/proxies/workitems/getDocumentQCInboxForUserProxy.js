const { get } = require('../requests');

/**
 * getDocumentQCInboxForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCInboxForUserInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
