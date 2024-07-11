import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls use case to complete work item for the pdf after signing
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {Function} providers.get the cerebral get helper function
 */
export const completeWorkItemForDocumentSigningAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
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
      // TODO 10417 I removed userId from what was passed in here because it doesn't appear to be used, but want to confirm.
      .completeWorkItemInteractor(applicationContext, {
        workItemId: workItemIdToClose,
      });
  }
};
