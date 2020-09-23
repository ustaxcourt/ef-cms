const { post } = require('../requests');

/**
 * removeSignatureFromDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document to remove signature from
 * @param {string} providers.docketEntryId the id of the docket entry for the signed document
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeSignatureFromDocumentInteractor = ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-signature`,
  });
};
