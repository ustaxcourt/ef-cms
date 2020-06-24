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
export const completeWorkItemForDocumentSigningAction = async ({
  applicationContext,
  get,
}) => {
  const messageId = get(state.currentViewMetadata.messageId);
  const caseDetail = get(state.caseDetail);
  const originalDocumentId = get(state.pdfForSigning.documentId);
  const document = caseDetail.documents.find(
    caseDocument => caseDocument.documentId === originalDocumentId,
  );

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
};
