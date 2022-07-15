import { state } from 'cerebral';

/**
 * generates an action for completing motion stamping
 *
 * @param {object} providers the providers object
 * @param {string} providers.get the cerebral get function
 * @param {string} providers.applicationContext the applicationContext
 * @returns {Function} the action to complete the motion stamping
 */
export const completeMotionStampingAction = async ({
  applicationContext,
  get,
}) => {
  const originalDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  let docketEntryId;

  console.log('state.pdfForSigning', get(state.pdfForSigning));
  console.log('state.form', get(state.form));

  // if (get(state.pdfForSigning.stampData.x)) {
  //   // TODO: add motion stamp data
  //   const {
  //     nameForSigning,
  //     nameForSigningLine2,
  //     pageNumber,
  //     stampData: { scale, x, y },
  //   } = get(state.pdfForSigning);

  //   const pdfjsObj = window.pdfjsObj || get(state.pdfForSigning.pdfjsObj);

  //   // generate signed document to bytes
  //   const signedPdfBytes = await applicationContext
  //     .getUseCases()
  //     .generateStampedDocumentInteractor(applicationContext, {
  //       pageIndex: pageNumber - 1,
  //       // pdf.js starts at 1
  //       pdfData: await pdfjsObj.getData(),
  //       posX: x,
  //       posY: y,
  //       scale,
  //       sigTextData: {
  //         signatureName: `(Signed) ${nameForSigning}`,
  //         signatureTitle: nameForSigningLine2,
  //       },
  //     });

  //   const documentFile = new File([signedPdfBytes], 'myfile.pdf', {
  //     type: 'application/pdf',
  //   });

  //   const signedDocumentFromUploadId = await applicationContext
  //     .getPersistenceGateway()
  //     .uploadDocumentFromClient({
  //       applicationContext,
  //       document: documentFile,
  //     });

  //   ({ signedDocketEntryId: docketEntryId } = await applicationContext
  //     .getUseCases()
  //     .saveSignedDocumentInteractor(applicationContext, {
  //       docketNumber,
  //       nameForSigning,
  //       originalDocketEntryId,
  //       parentMessageId,
  //       signedDocketEntryId: signedDocumentFromUploadId,
  //     }));
  // }

  let redirectUrl;

  if (parentMessageId) {
    redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${originalDocketEntryId}`;
  } else {
    redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${originalDocketEntryId}`;
  }

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
