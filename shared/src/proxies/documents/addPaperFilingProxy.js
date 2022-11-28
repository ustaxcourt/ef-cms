const { post } = require('../requests');

/**
 * addPaperFilingProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection id
 * @param {object} providers.consolidatedGroupDocketNumbers the consolidated group's docket numbers
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @param {string} providers.secondaryDocumentFileId the id of the secondary document file (optional)
 * @param {string} providers.secondarySupportingDocumentFileId the id of the secondary supporting document file (optional)
 * @param {string} providers.supportingDocumentFileId the id of the supporting document file (optional)
 * @returns {Promise<*>} the promise of the api call
 */
exports.addPaperFilingInteractor = (
  applicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    documentMetadata,
    isSavingForLater,
    primaryDocumentFileId,
  },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      clientConnectionId,
      consolidatedGroupDocketNumbers,
      documentMetadata,
      isSavingForLater,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/paper-filing`,
  });
};
