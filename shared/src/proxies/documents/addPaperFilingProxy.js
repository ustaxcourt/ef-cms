const { post } = require('../requests');

/**
 * addPaperFilingProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection id
 * @param {object} providers.data the data being forwarded to the API call
 * @returns {Promise<*>} the promise of the api call
 */
exports.addPaperFilingInteractor = (
  applicationContext,
  data,
  clientConnectionId,
) => {
  const { documentMetadata } = data;
  const { docketNumber } = documentMetadata;

  return post({
    applicationContext,
    body: {
      clientConnectionId,
      ...data,
    },
    endpoint: `/case-documents/${docketNumber}/paper-filing`,
  });
};
