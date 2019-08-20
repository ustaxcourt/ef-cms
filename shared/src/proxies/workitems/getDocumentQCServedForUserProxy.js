const { get } = require('../requests');

/**
 * getDocumentQCServedForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the document qc served box
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCServedForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
