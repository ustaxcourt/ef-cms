import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkViewsQCInProgress = (cerebralTest, shouldExist) => {
  return it('Docket clerk views My Document QC - In Progress', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = cerebralTest.getState('workQueue');
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId ===
        cerebralTest.docketRecordEntry.docketEntryId,
    );
    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
