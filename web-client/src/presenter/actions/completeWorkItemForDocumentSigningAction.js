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
  const originalDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const document = caseDetail.docketEntries.find(
    caseDocument => caseDocument.docketEntryId === originalDocketEntryId,
  );

  if (messageId && document) {
    const workItemIdToClose = document.workItem.workItemId;

    await applicationContext
      .getUseCases()
      .completeWorkItemInteractor(applicationContext, {
        userId: applicationContext.getCurrentUser().userId,
        workItemId: workItemIdToClose,
      });
  }
};
