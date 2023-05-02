import { runCompute } from 'cerebral/test';
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
    if (cerebralTest.petitionsClerkMyDocumentQCInboxCount) {
      expect(helper.individualInboxCount).toEqual(
        cerebralTest.petitionsClerkMyDocumentQCInboxCount +
          adjustExpectedCountBy,
      );
    } else {
      expect(helper.individualInboxCount).toBeGreaterThan(0);
    }
  });
};
