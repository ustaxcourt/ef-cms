import { state } from 'cerebral';
import _ from 'lodash';

/**
 * Uses state-side signature data (coordinates, page number, PDFJS Object) to apply
 * the signature to a new PDF and upload to S3, then calls a use case to attach the
 * new document to the associated case.
 *
 * @param {object} applicationContext the applicationContext object
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get helper function
 * @returns {void}
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
    .generateSignedDocument({
      pageIndex: pageNumber - 1, // pdf.js starts at 1
      pdfData: await pdfjsObj.getData(),
      posX: x,
      posY: y,
      scale,
      sigTextData: `(Signed) ${name}`,
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

  const workItems = await applicationContext.getUseCases().getWorkItemsForUser({
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
};
