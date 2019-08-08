import { getFormattedMyInbox } from '../helpers';
export default (test, message) => {
  describe('Docket Clerk navigates to My Inbox', () => {
    it('navigates to inbox', async () => {
      await test.runSequence('navigateToPathSequence', {
        path: '/messages/my/inbox',
      });
    });

    it('verifies the stipulated decision exists', async () => {
      const myInbox = await getFormattedMyInbox(test);
      const stipDecision = myInbox.find(
        item =>
          item.document.documentType === 'Stipulated Decision' &&
          (message ? item.currentMessage.message === message : true),
      );

      expect(stipDecision).not.toBeUndefined();
      if (message) {
        expect(stipDecision.currentMessage.message).toEqual(message);
      }
    });
  });
};
