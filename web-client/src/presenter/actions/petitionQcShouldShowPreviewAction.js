import { state } from 'cerebral';

/**
 * fixme
 * returns the yes path with file prop for the current document selected for scan, or the no path, otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {undefined}
 */
export const petitionQcShouldShowPreviewAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  console.log('documentSelectedForPreview', documentSelectedForPreview);

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

  const documentTypeSelectedForPreview =
    documentTypeMap[documentSelectedForPreview];

  const { docketNumber, documents } = get(state.form);

  const selectedDocument = get(documents).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  let pdfUrl;
  let selectedDocumentId;

  if (selectedDocument) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        docketNumber,
        documentId: selectedDocument.documentId,
      });

    pdfUrl = url;
    selectedDocumentId = selectedDocument.documentId;
  }

  //should be getting from form.documents????
  //check if pdf is on form aka in memory
  // if not,
  const file = get(state.form[documentSelectedForPreview]);

  if (file) {
    return path.pdfInMemory({ file });
  }

  if (selectedDocument) {
    return path.pdfInS3({ documentId: selectedDocumentId, pdfUrl });
  }

  return path.no();
};
