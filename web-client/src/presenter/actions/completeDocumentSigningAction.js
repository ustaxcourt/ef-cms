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
  const originalDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  let docketEntryId;

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
      .generateSignedDocumentInteractor(applicationContext, {
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

    const signedDocumentFromUploadId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFile,
        onUploadProgress: () => {},
      });

    ({ signedDocketEntryId: docketEntryId } = await applicationContext
      .getUseCases()
      .saveSignedDocumentInteractor(applicationContext, {
        docketNumber,
        nameForSigning,
        originalDocketEntryId,
        parentMessageId,
        signedDocketEntryId: signedDocumentFromUploadId,
      }));
  }

  let redirectUrl;

  if (parentMessageId) {
    redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`;
  } else {
    redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${docketEntryId}`;
  }

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
