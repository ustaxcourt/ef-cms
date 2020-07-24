const { get } = require('./requests');

/**
 * getDocumentDownloadUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number for the case containing the document
 * @param {string} providers.documentId the document id to retrieve
 * @param {boolean} providers.isPublic whether the url is for the public site or not
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentDownloadUrlInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
  isPublic,
}) => {
  return get({
    applicationContext,
    endpoint: isPublic
      ? `/public-api/${docketNumber}/${documentId}/public-document-download-url`
      : `/case-documents/${docketNumber}/${documentId}/document-download-url`,
  });
};
