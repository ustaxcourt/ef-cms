import { getFormattedMyOutbox } from '../helpers';
export default (test, message) => {
  describe('Docket Clerk navigates to My Inbox', () => {
    it('navigates to inbox', async () => {
      await test.runSequence('navigateToPathSequence', {
        path: '/messages/my/inbox',
      });
    });

    it('verifies the stipulated decision exists', async () => {
      const myInbox = await getFormattedMyOutbox(test);
      const stipDecision = myInbox.find(
        item => item.document.documentType === 'Proposed Stipulated Decision',
      );

      expect(stipDecision).not.toBeNull();

      if (message) {
        expect(stipDecision.currentMessage.message).toEqual(message);
      }
    });
  });
};
