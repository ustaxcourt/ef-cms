export default test => {
  return it('Petitions clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsMessages: false,
    });
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === test.petitionWorkItemId);
    expect(workItem).toBeDefined();
  });
};
