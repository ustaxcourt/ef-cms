import { runCompute } from 'cerebral/test';
import { workQueueHelper } from '../../src/presenter/computeds/workQueueHelper';

export default test => {
  return it('Petitions clerk gets My Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (test.petitionsClerkMyDocumentQCInboxCount) {
      // should refactor test.taxpayerNewCases in favor of something more universal when the need arises
      expect(helper.inboxCount).toEqual(
        test.petitionsClerkMyDocumentQCInboxCount +
          (test.taxpayerNewCases.length || 0),
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
