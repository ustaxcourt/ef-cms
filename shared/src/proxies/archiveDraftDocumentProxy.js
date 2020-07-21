const { remove } = require('./requests');

/**
 * archiveDraftDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the document id to archive
 * @returns {Promise<*>} the promise of the api call
 */
exports.archiveDraftDocumentInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${caseId}/${documentId}`,
  });
};
