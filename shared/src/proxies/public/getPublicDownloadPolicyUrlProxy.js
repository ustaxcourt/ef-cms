const { get } = require('./requests');

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the document id to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicDownloadPolicyUrl = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return get({
    applicationContext,
    endpoint: `/public-api/${caseId}/${documentId}/public-download-policy-url`,
  });
};
