const { post } = require('../requests');

/**
 * fileExternalDocumentForConsolidatedProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.documentIds the document ids for the primary, supporting,
 * secondary, and secondary supporting documents
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @param {object} providers.leadDocketNumber the docket number for the lead case in the consolidated set
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileExternalDocumentForConsolidatedInteractor = ({
  applicationContext,
  docketNumbersForFiling,
  documentIds,
  documentMetadata,
  leadDocketNumber,
}) => {
  return post({
    applicationContext,
    body: {
      docketNumbersForFiling,
      documentIds,
      documentMetadata,
    },
    endpoint: `/case-documents/consolidated/${leadDocketNumber}/external-document`,
  });
};
