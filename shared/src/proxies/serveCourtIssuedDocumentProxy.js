const { post } = require('./requests');

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {object} providers.docketEntryId the id of the docket entry
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCourtIssuedDocumentInteractor = (
  applicationContext,
  { docketEntryId, docketNumbers, subjectCaseDocketNumber },
  clientConnectionId,
) => {
  return post({
    applicationContext,
    body: { clientConnectionId, docketNumbers },
    endpoint: `/case-documents/${subjectCaseDocketNumber}/${docketEntryId}/serve-court-issued`,
  });
};
