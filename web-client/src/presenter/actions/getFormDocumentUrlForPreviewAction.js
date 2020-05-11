import { state } from 'cerebral';

/**
 * gets the form document based on the state of currentViewMetadata.documentSelectedForPreview
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing pdfUrl
 */
export const getFormDocumentUrlForPreviewAction = ({
  applicationContext,
  get,
}) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  const documentTypeMap = {
    applicationForWaiverOfFilingFeeFile:
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
    ownershipDisclosureFile:
      INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    petitionFile: INITIAL_DOCUMENT_TYPES.petition.documentType,
    requestForPlaceOfTrialFile:
      INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
    stinFile: INITIAL_DOCUMENT_TYPES.stin.documentType,
  };
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const documentTypeSelectedForPreview =
    documentTypeMap[documentSelectedForPreview];

  const { caseId, documents } = get(state.form);

  const document = get(documents).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  let pdfUrl;
  if (document) {
    const baseUrl = get(state.baseUrl);
    const token = get(state.token);

    pdfUrl = `${baseUrl}/case-documents/${caseId}/${document.documentId}/document-download-url?token=${token}`;
  }

  return { pdfUrl };
};
