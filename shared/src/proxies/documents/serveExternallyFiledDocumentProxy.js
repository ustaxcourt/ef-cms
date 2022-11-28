const { post } = require('../requests');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection id
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {object} providers.docketNumbers the consolidated group's docket numbers
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveExternallyFiledDocumentInteractor = (
  applicationContext,
  { clientConnectionId, docketEntryId, docketNumbers, subjectCaseDocketNumber },
) => {
  return post({
    applicationContext,
    body: { clientConnectionId, docketNumbers },
    endpoint: `/case-documents/${subjectCaseDocketNumber}/${docketEntryId}/serve`,
  });
};
