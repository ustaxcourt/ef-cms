export const petitionsClerkViewsWorkQueueAfterReassign = cerebralTest => {
  return it('Petitions clerk views work queue after reassign', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    const workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.workItemId === cerebralTest.petitionWorkItemId,
      );
    expect(workItem).toBeDefined();
  });
};
