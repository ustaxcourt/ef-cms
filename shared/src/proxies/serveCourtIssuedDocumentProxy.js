const { post } = require('./requests');

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} documentMeta the data being forwarded to the API call
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCourtIssuedDocumentInteractor = (
  applicationContext,
  documentMeta,
  clientConnectionId,
) => {
  const { docketEntryId, subjectCaseDocketNumber } = documentMeta;

  return post({
    applicationContext,
    body: { clientConnectionId, ...documentMeta },
    endpoint: `/case-documents/${subjectCaseDocketNumber}/${docketEntryId}/serve-court-issued`,
  });
};
