export const docketClerkViewsSectionQCInProgress = (
  cerebralTest,
  shouldExist,
) => {
  return it('Docket clerk views Section Document QC - In Progress', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = cerebralTest.getState('workQueue');
    const inProgressWorkItem = inProgressQueue.find(
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
