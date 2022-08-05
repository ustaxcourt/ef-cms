export const docketClerkViewsQCOutbox = (cerebralTest, shouldExist) => {
  return it('Docket clerk views My Document QC - Outbox', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('inbox');
    expect(workQueueToDisplay.box).toEqual('section');

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
