import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkVerifiesQCItemNotInSectionInbox = (
  cerebralTest,
  documentType,
) => {
  return it('Docket clerk verifies QC item not in section inbox', async () => {
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const qcItem = workQueueFormatted.find(
      workItem =>
        workItem.docketNumber === cerebralTest.docketNumber &&
        workItem.docketEntry.documentType === documentType,
    );

    expect(qcItem).toBeUndefined();
  });
};
