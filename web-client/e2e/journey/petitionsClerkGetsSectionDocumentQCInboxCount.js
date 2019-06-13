import { runCompute } from 'cerebral/test';
import { workQueueHelper } from '../../src/presenter/computeds/workQueueHelper';

export default (test, adjustExpectedCountBy = 0) => {
  return it('Petitions clerk gets Section Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (test.petitionsClerkSectionDocumentQCInboxCount) {
      expect(helper.inboxCount).toEqual(
        test.petitionsClerkSectionDocumentQCInboxCount + adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
