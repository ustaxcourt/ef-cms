import { state } from 'cerebral';

/**
 * Uses state-side signature data (coordinates, page number, PDFJS Object) to apply
 * the signature to a new PDF and upload to S3, then calls a use case to attach the
 * new document to the associated case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} object with new document id
 */
export const completeDocumentSigningAction = async ({
  applicationContext,
  get,
}) => {
  const messageId = get(state.messageId);
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

    const { pdfjsObj } =
      window.pdfjsObj !== undefined ? window : get(state.pdfForSigning);

    // generate signed document to bytes
    const signedPdfBytes = await applicationContext
      .getUseCases()
      .generateSignedDocumentInteractor({
        pageIndex: pageNumber - 1, // pdf.js starts at 1
        pdfData: await pdfjsObj.getData(),
        posX: x,
        posY: y,
        scale,
        sigTextData: {
          signatureName: `(Signed) ${nameForSigning}`,
          signatureTitle: nameForSigningLine2,
        },
      });

    let documentFile;

    if (typeof File === 'function') {
      documentFile = new File([signedPdfBytes], 'myfile.pdf');
    } else {
      documentFile = Buffer.from(signedPdfBytes, 'base64');
      documentFile.name = 'myfile.pdf';
    }

    let documentIdToOverwrite = null;
    if (document.documentType !== 'Proposed Stipulated Decision') {
      documentIdToOverwrite = originalDocumentId;
    }

    const signedDocumentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: documentFile,
        documentId: documentIdToOverwrite,
        onUploadProgress: () => {},
      });

    documentIdToReturn = signedDocumentId;

    await applicationContext.getUseCases().signDocumentInteractor({
      applicationContext,
      caseId,
      originalDocumentId,
      signedDocumentId,
    });
  }

  if (messageId) {
    const workItemIdToClose = document.workItems.find(workItem =>
      workItem.messages.find(message => message.messageId === messageId),
    ).workItemId;

    await applicationContext.getUseCases().completeWorkItemInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
      workItemId: workItemIdToClose,
    });
  }

  return {
    alertSuccess: {
      message: 'Your signature has been added',
      title: '',
    },
    caseId,
    documentId: documentIdToReturn,
    tab: 'docketRecord',
  };
};
