import { state } from 'cerebral';

/**
 * generates an action for completing document signing
 *
 * @param {object} providers the providers object
 * @param {string} providers.get the cerebral get function
 * @param {string} providers.applicationContext the applicationContext
 * @returns {Function} the action to complete the document signing
 */
export const completeDocumentSigningAction = async ({
  applicationContext,
  get,
}) => {
  const originalDocumentId = get(state.pdfForSigning.documentId);
  const caseId = get(state.caseDetail.caseId);
  const caseDetail = get(state.caseDetail);
  let documentIdToReturn = originalDocumentId;
  const document = caseDetail.documents.find(
    caseDocument => caseDocument.documentId === originalDocumentId,
  );

  if (get(state.pdfForSigning.signatureData.x)) {
    const {
      nameForSigning,
      nameForSigningLine2,
      pageNumber,
      signatureData: { scale, x, y },
    } = get(state.pdfForSigning);

    const pdfjsObj = window.pdfjsObj || get(state.pdfForSigning.pdfjsObj);

    // generate signed document to bytes
    const signedPdfBytes = await applicationContext
      .getUseCases()
      .generateSignedDocumentInteractor({
        applicationContext,
        pageIndex: pageNumber - 1,
        // pdf.js starts at 1
        pdfData: await pdfjsObj.getData(),
        posX: x,
        posY: y,
        scale,
        sigTextData: {
          signatureName: `(Signed) ${nameForSigning}`,
          signatureTitle: nameForSigningLine2,
        },
      });

    const documentFile = new File([signedPdfBytes], 'myfile.pdf', {
      type: 'application/pdf',
    });

    let documentIdToOverwrite = null;
    if (document.documentType !== 'Proposed Stipulated Decision') {
      documentIdToOverwrite = originalDocumentId;
    }

    const signedDocumentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFile,
        documentId: documentIdToOverwrite,
        onUploadProgress: () => {},
      });

    documentIdToReturn = signedDocumentId;

    await applicationContext.getUseCases().saveSignedDocumentInteractor({
      applicationContext,
      caseId,
      nameForSigning,
      originalDocumentId,
      signedDocumentId,
    });
  }

  return {
    caseId,
    documentId: documentIdToReturn,
    tab: 'docketRecord',
  };
};
