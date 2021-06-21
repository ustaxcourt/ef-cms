const { get } = require('../requests');

/**
 * getDocumentQCServedForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc served box
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCServedForUserInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
