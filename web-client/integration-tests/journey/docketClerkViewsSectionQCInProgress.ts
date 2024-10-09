import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsSectionQCInProgress = (
  cerebralTest,
  shouldExist,
) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  return it('Docket clerk views Section Document QC - In Progress', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');
    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId ===
        cerebralTest.docketRecordEntry.docketEntryId,
    );

    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
      expect(inProgressWorkItem.docketEntry.otherFilingParty).toEqual(
        'Brianna Noble',
      );
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
