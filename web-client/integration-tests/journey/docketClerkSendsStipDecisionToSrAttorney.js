import { createMessage, viewDocumentDetailMessage } from '../helpers';

export default test => {
  describe('Docket Clerk sends Proposed Stipulated Decision to Sr. Attorney', () => {
    it('sends the stipulated decision', async () => {
      const { stipDecision } = test;

      await viewDocumentDetailMessage({
        docketNumber: stipDecision.docketNumber,
        documentId: stipDecision.document.documentId,
        messageId: stipDecision.currentMessage.messageId,
        test,
        workItemIdToMarkAsRead: stipDecision.workItemId,
      });
      await createMessage({
        assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Jeff, this is ready for review and signature',
        test,
      });
    });
  });
};
