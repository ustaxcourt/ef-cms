import { getFormattedMyOutbox } from '../helpers';
export default test => {
  describe('Senior Attorney navigates to My Outbox', () => {
    it('navigates to outbox', async () => {
      await test.runSequence('navigateToPathSequence', {
        path: '/messages/my/outbox',
      });
    });

    it('verifies the stipulated decision exists', async () => {
      const myInbox = await getFormattedMyOutbox(test);
      const stipDecision = myInbox.find(
        item => item.document.documentType === 'Signed Stipulated Decision',
      );

      expect(stipDecision).not.toBeNull();
    });
  });
};
