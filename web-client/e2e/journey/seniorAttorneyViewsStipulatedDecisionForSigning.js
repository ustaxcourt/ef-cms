import { getFormattedMyInbox, viewDocumentDetailMessage } from '../helpers';
export default test => {
  describe('Senior Attorney views inbox and selects a Stipulated Decision for signing', () => {
    it('views inbox', async () => {
      const myInbox = await getFormattedMyInbox(test);
      const stipDecision = myInbox.find(
        item => item.document.documentType === 'Proposed Stipulated Decision',
      );
      test.stipDecision = stipDecision;
      expect(stipDecision).not.toBeNull();
    });

    it('selects the stipulated decision from inbox and signs it', async () => {
      const { stipDecision } = test;

      await viewDocumentDetailMessage({
        docketNumber: stipDecision.docketNumber,
        documentId: stipDecision.document.documentId,
        messageId: stipDecision.currentMessage.messageId,
        test,
        workItemIdToMarkAsRead: stipDecision.workItemId,
      });

      await test.runSequence('gotoSignPDFDocumentSequence', {
        documentId: stipDecision.document.documentId,
        pageNumber: 1,
      });

      // set signature data
      await test.runSequence('setPDFSignatureDataSequence', {
        signatureData: {
          scale: 1,
          x: 100,
          y: 100,
        },
      });

      // set message
      test.setState('form', {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        message:
          'Donna, this is not ready to serve. I need to follow up on something first',
        section: 'docket',
      });

      // complete signing
      await test.runSequence('completeDocumentSigningSequence');
      const newSignatureData = test.getState('pdfForSigning.signatureData');
      expect(newSignatureData).toBeNull();
    });
  });
};
