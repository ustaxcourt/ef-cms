import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsMyDocumentQCInboxCount = (
  cerebralTest,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets My Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: cerebralTest.getState(),
    });

    if (cerebralTest.petitionsClerkMyDocumentQCInboxCount !== undefined) {
      expect(helper.individualInboxCount).toBeGreaterThanOrEqual(
        cerebralTest.petitionsClerkMyDocumentQCInboxCount +
          adjustExpectedCountBy,
      );
    } else {
      expect(helper.individualInboxCount).toBeGreaterThanOrEqual(0);
    }
  });
};
