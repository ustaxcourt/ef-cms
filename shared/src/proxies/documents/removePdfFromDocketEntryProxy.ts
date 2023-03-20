const { post } = require('../requests');

/**
 * removePdfFromDocketEntryInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document to remove signature from
 * @param {string} providers.docketEntryId the id of the docket entry for the signed document
 * @returns {Promise<*>} the promise of the api call
 */
exports.removePdfFromDocketEntryInteractor = (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-pdf`,
  });
};
