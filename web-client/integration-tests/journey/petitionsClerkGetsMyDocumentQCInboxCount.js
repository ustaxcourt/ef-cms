import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsMyDocumentQCInboxCount = (
  test,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets My Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: test.getState(),
    });
    if (test.petitionsClerkMyDocumentQCInboxCount) {
      expect(helper.inboxCount).toEqual(
        test.petitionsClerkMyDocumentQCInboxCount + adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
