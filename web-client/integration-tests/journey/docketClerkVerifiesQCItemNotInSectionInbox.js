import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
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

    console.log('workQueueFormatted:', workQueueFormatted);

    const qcItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(qcItem).toMatchObject({
      docketEntry: {
        documentType,
      },
    });
  });
};
