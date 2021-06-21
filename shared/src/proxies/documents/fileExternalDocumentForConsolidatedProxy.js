const { post } = require('../requests');

/**
 * fileExternalDocumentForConsolidatedProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @param {object} providers.leadDocketNumber the docket number for the lead case in the consolidated set
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileExternalDocumentForConsolidatedInteractor = (
  applicationContext,
  { docketNumbersForFiling, documentMetadata, leadDocketNumber },
) => {
  return post({
    applicationContext,
    body: {
      docketNumbersForFiling,
      documentMetadata,
    },
    endpoint: `/case-documents/consolidated/${leadDocketNumber}/external-document`,
  });
};
