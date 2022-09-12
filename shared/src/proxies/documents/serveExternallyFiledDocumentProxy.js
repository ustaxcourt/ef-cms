const { post } = require('../requests');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.consolidatedGroupDocketNumbers the consolidated group's docket numbers
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveExternallyFiledDocumentInteractor = (
  applicationContext,
  { consolidatedGroupDocketNumbers, docketEntryId, docketNumber },
) => {
  return post({
    applicationContext,
    body: consolidatedGroupDocketNumbers,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/serve`,
  });
};
