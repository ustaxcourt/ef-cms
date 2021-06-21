const { get } = require('./requests');

/**
 * getDocumentDownloadUrlInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number for the case containing the document
 * @param {string} providers.key the key of the document to retrieve
 * @param {boolean} providers.isPublic whether the url is for the public site or not
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentDownloadUrlInteractor = (
  applicationContext,
  { docketNumber, isPublic, key },
) => {
  return get({
    applicationContext,
    endpoint: isPublic
      ? `/public-api/${docketNumber}/${key}/public-document-download-url`
      : `/case-documents/${docketNumber}/${key}/document-download-url`,
  });
};
