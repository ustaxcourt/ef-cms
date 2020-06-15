const { get } = require('./requests');

/**
 * getDocumentDownloadUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id for the case containing the document
 * @param {string} providers.caseId the document id to retrieve
 * @param {boolean} providers.isPublic whether the url is for the public site or not
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
