import { state } from 'cerebral';

export const completeDocumentSigningAction = async ({
  applicationContext,
  get,
}) => {
  const {
    documentId: originalDocumentId,
    pageNumber,
    signatureData: { scale, x, y },
  } = get(state.pdfForSigning);
  const { caseId } = get(state.caseDetail);

  const { pdfjsObj } = window || get(state.pdfForSigning);

  // generate signed document to bytes
  const signedPdfBytes = await applicationContext
    .getUseCases()
    .generateSignedDocument({
      pageIndex: pageNumber - 1, // pdf.js starts at 1
      pdfData: await pdfjsObj.getData(),
      posX: x,
      posY: y,
      scale,
      sigTextData: 'Guy Fieri',
    });

  const signedDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: new File([signedPdfBytes], 'myfile.pdf'),
      onUploadProgress: () => {},
    });

  await applicationContext.getUseCases().signDocument({
    applicationContext,
    caseId,
    originalDocumentId,
    signedDocumentId,
  });
};
