import { state } from '@web-client/presenter/app.cerebral';

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

  const workItemIdToClose = document?.workItemId;

  if (messageId && workItemIdToClose) {
    await applicationContext
      .getUseCases()
      .completeWorkItemInteractor(applicationContext, {
        workItemId: workItemIdToClose,
      });
  }
};
