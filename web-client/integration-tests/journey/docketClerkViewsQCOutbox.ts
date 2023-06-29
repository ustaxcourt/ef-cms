export const docketClerkViewsQCOutbox = (cerebralTest, shouldExist) => {
  return it('Docket clerk views My Document QC - Outbox', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('outbox');

    const outboxQueue = cerebralTest.getState('workQueue');
    const outboxWorkItem = outboxQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId,
    );
    if (shouldExist) {
      expect(outboxWorkItem).toBeTruthy();
    } else {
      expect(outboxWorkItem).toBeFalsy();
    }
  });
};
