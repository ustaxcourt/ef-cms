import { state } from 'cerebral';

/**
 * gets the form document based on the state of currentViewMetadata.documentSelectedForPreview
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing pdfUrl
 */
export const getFormDocumentUrlForPreviewAction = async ({
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

  const selectedDocument = get(documents).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  let pdfUrl;
  if (selectedDocument) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        caseId,
        documentId: selectedDocument.documentId,
      });

    pdfUrl = url;
  }

  return { pdfUrl };
};
