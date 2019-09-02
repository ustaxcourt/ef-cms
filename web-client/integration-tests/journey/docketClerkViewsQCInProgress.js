export default (test, shouldExist) => {
  return it('Docket clerk views My Document QC - In Progress', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
      workQueueIsMessages: false,
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');
    const workQueueIsMessages = test.getState('workQueueIsMessages');

    expect(workQueueIsMessages).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = test.getState('workQueue');
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.document.documentId === test.docketRecordEntry.documentId,
    );
    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
