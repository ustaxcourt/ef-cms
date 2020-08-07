const { post } = require('../requests');

/**
 * addCoversheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.documentId the document id
 * @returns {Promise<*>} the promise of the api call
 */
exports.addCoversheetInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${documentId}/coversheet`,
  });
};
