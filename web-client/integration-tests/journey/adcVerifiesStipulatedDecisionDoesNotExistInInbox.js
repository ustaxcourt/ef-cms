import { applicationContext } from '../../src/applicationContext';
import { getFormattedMyInbox } from '../helpers';

export const adcVerifiesStipulatedDecisionDoesNotExistInInbox = test => {
  describe('ADC verifies Stipulated Decision does not exist in inbox', () => {
    it('navigates to inbox', async () => {
      await test.runSequence('navigateToPathSequence', {
        path: '/messages/my/inbox',
      });
    });

    it('verifies the stipulated decision does not exist', async () => {
      const currentUser = applicationContext.getCurrentUser();
      const myInbox = await getFormattedMyInbox(test);
      const stipDecision = myInbox.find(
        item =>
          item.document.documentType === 'Proposed Stipulated Decision' &&
          item.assigneeId !== currentUser.userId,
      );

      expect(stipDecision).toBeUndefined();
    });
  });
};
