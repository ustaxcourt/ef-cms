import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export default (test, adjustExpectedCountBy = 0) => {
  return it('Petitions clerk gets Section Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (test.petitionsClerkSectionDocumentQCInboxCount !== undefined) {
      expect(helper.inboxCount).toEqual(
        test.petitionsClerkSectionDocumentQCInboxCount + adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
