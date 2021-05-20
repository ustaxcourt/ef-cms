const { get } = require('../requests');

/**
 * getDocumentContentsForDocketEntryInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.documentContentsId the documentContentsId
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentContentsForDocketEntryInteractor = (
  applicationContext,
  { documentContentsId },
) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${documentContentsId}/document-contents`,
  });
};
