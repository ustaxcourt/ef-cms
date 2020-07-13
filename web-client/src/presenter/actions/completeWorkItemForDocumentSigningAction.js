import { state } from 'cerebral';

/**
 * calls use case to complete work item for the pdf after signing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {Function} providers.get the cerebral get helper function
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

  if (messageId && document) {
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
