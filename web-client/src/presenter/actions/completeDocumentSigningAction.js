import { state } from 'cerebral';
import _ from 'lodash';

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
  const {
    documentId: originalDocumentId,
    pageNumber,
    signatureData: { scale, x, y },
  } = get(state.pdfForSigning);
  const { caseId } = get(state.caseDetail);

  const { pdfjsObj } =
    window.pdfjsObj !== undefined ? window : get(state.pdfForSigning);

  const { name } = applicationContext.getCurrentUser();

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
        signatureName: `(Signed) ${name}`,
        signatureTitle: 'Chief Judge',
      },
    });

  let documentFile;

  if (typeof File === 'function') {
    documentFile = new File([signedPdfBytes], 'myfile.pdf');
  } else {
    documentFile = Buffer.from(signedPdfBytes, 'base64');
    documentFile.name = 'myfile.pdf';
  }

  const signedDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: documentFile,
      onUploadProgress: () => {},
    });

  await applicationContext.getUseCases().signDocumentInteractor({
    applicationContext,
    caseId,
    originalDocumentId,
    signedDocumentId,
  });

  const workItems = await applicationContext
    .getUseCases()
    .getInboxMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  const stipulatedWorkItems = workItems.filter(
    workItem =>
      workItem.document.documentType === 'Proposed Stipulated Decision' &&
      !workItem.completedAt,
  );

  const { workItemId } = _.head(stipulatedWorkItems);

  await applicationContext.getUseCases().completeWorkItemInteractor({
    applicationContext,
    userId: applicationContext.getCurrentUser().userId,
    workItemId,
  });

  return { documentId: signedDocumentId };
};
