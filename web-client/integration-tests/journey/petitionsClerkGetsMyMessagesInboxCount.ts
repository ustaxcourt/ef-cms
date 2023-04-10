import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsMyMessagesInboxCount = (
  cerebralTest,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets My Messages Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: cerebralTest.getState(),
    });
    if (cerebralTest.petitionsClerkMyMessagesInboxCount != null) {
      expect(helper.inboxCount).toEqual(
        cerebralTest.petitionsClerkMyMessagesInboxCount + adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
