import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsQCInProgress = (cerebralTest, shouldExist) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  return it('Docket clerk views My Document QC - In Progress', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId ===
        cerebralTest.docketRecordEntry.docketEntryId,
    );
    if (shouldExist) {
      expect(inProgressWorkItem).toBeDefined();
    } else {
      expect(inProgressWorkItem).not.toBeDefined();
    }
  });
};
