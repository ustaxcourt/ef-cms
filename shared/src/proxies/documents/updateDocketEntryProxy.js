const { put } = require('../requests');

/**
 * updateDocketEntryProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @param {string} providers.secondaryDocumentFileId the id of the secondary document file (optional)
 * @param {string} providers.secondarySupportingDocumentFileId the id of the secondary supporting document file (optional)
 * @param {string} providers.supportingDocumentFileId the id of the supporting document file (optional)
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateDocketEntryInteractor = ({
  applicationContext,
  documentMetadata,
  isSavingForLater,
  primaryDocumentFileId,
}) => {
  const { caseId } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
      isSavingForLater,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${caseId}/docket-entry`,
  });
};
