import { getFormattedMyInbox } from '../helpers';

export const adcViewsStipulatedDecisionForSigning = test => {
  describe('ADC views inbox and selects a Stipulated Decision for signing', () => {
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

      await test.runSequence('gotoSignOrderSequence', {
        docketNumber: stipDecision.docketNumber,
        documentId: stipDecision.document.documentId,
      });

      // set signature data
      await test.runSequence('setPDFSignatureDataSequence', {
        signatureData: {
          scale: 1,
          x: 100,
          y: 100,
        },
      });

      // complete signing
      await test.runSequence('saveDocumentSigningSequence');
      const newSignatureData = test.getState('pdfForSigning.signatureData');
      expect(newSignatureData).toBeUndefined();
    });
  });
};
