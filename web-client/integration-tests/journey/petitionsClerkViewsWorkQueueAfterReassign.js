export const petitionsClerkViewsWorkQueueAfterReassign = test => {
  return it('Petitions clerk views work queue after reassign', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === test.petitionWorkItemId);
    expect(workItem).toBeDefined();
  });
};
