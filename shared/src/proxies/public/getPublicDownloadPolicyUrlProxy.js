const { get } = require('./requests');

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.documentId the document id
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicDownloadPolicyUrl = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return get({
    applicationContext,
    endpoint: `/public-api/${docketNumber}/${documentId}/public-download-policy-url`,
  });
};
