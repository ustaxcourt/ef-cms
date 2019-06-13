import { runCompute } from 'cerebral/test';
import { workQueueHelper } from '../../src/presenter/computeds/workQueueHelper';

export default (test, adjustExpectedCountBy = 0) => {
  return it('Petitions clerk gets My Messages Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (test.petitionsClerkMyMessagesInboxCount) {
      expect(helper.inboxCount).toEqual(
        test.petitionsClerkMyMessagesInboxCount + adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
