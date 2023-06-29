import { getFormattedDocumentQCSectionInbox } from '../helpers';

export const docketClerkViewsStipulatedDecision = cerebralTest => {
  describe('a docket clerk views Section Document QC and selects a Stipulated Decision', () => {
    it('views Section Document QC box', async () => {
      const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
        cerebralTest,
      );
      const stipDecision = documentQCSectionInbox.find(
        item =>
          item.docketEntry.documentType === 'Proposed Stipulated Decision',
      );
      cerebralTest.stipDecision = stipDecision;
      expect(stipDecision).not.toBeNull();
    });
  });
};
