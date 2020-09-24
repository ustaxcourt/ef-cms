export const docketClerkViewsQCInProgress = (test, shouldExist) => {
  return it('Docket clerk views My Document QC - In Progress', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = test.getState('workQueue');
    console.log(''); // adding this causes the tests to pass....
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId ===
        test.docketRecordEntry.docketEntryId,
    );
    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
