const { get } = require('./requests');

/**
 * getDocumentDownloadUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentDownloadUrlInteractor = ({
  applicationContext,
  caseId,
  documentId,
  isPublic,
}) => {
  return get({
    applicationContext,
    endpoint: isPublic
      ? `/public-api/${caseId}/${documentId}/public-document-download-url`
      : `/case-documents/${caseId}/${documentId}/document-download-url`,
  });
};
