import { runCompute } from 'cerebral/test';
import { workQueueHelper } from '../../src/presenter/computeds/workQueueHelper';

export default (test, expectedCount) => {
  return it('Petitions clerk gets My Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (expectedCount) {
      expect(helper.inboxCount).toEqual(expectedCount);
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
