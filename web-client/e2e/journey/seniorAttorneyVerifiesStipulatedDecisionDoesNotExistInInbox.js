import { getFormattedMyInbox } from '../helpers';
export default test => {
  describe('Senior Attorney verifies Stipulated Decision does not exist in inbox', () => {
    it('navigates to inbox', async () => {
      await test.runSequence('navigateToPathSequence', {
        path: '/messages/my/inbox',
      });
    });

    it('verifies the stipulated decision does not exist', async () => {
      const myInbox = await getFormattedMyInbox(test);
      const stipDecision = myInbox.find(
        item => item.document.documentType === 'Proposed Stipulated Decision',
      );

      expect(stipDecision).toBeNull();
    });
  });
};
