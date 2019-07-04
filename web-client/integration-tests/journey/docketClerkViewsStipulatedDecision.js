import { getFormattedDocumentQCSectionInbox } from '../helpers';
export default test => {
  describe('a docket clerk views Section Document QC and selects a Stipulated Decision', () => {
    it('views Section Document QC box', async () => {
      const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
        test,
      );
      const stipDecision = documentQCSectionInbox.find(
        item => item.document.documentType === 'Proposed Stipulated Decision',
      );
      test.stipDecision = stipDecision;
      expect(stipDecision).not.toBeNull();
    });
  });
};
