export const docketClerkViewsQCOutbox = (test, shouldExist) => {
  return it('Docket clerk views My Document QC - Outbox', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('outbox');

    const outboxQueue = test.getState('workQueue');
    const outboxWorkItem = outboxQueue.find(
      workItem => workItem.docketEntry.docketEntryId === test.docketEntryId,
    );
    if (shouldExist) {
      expect(outboxWorkItem).toBeTruthy();
    } else {
      expect(outboxWorkItem).toBeFalsy();
    }
  });
};
