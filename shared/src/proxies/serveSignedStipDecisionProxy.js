const { put } = require('./requests');

/**
 * updatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id of the case containing the document to serve
 * @param {string} providers.documentId the document id of the signed stipulated decision document
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveSignedStipDecisionInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return put({
    applicationContext,
    body: { caseId, documentId },
    endpoint: `/case-documents/${caseId}/documents/${documentId}/serve`,
  });
};
