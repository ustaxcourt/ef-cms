export default test => {
  return it('Petitions clerk views messages', async () => {
    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: false,
    });
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === test.petitionWorkItemId);
    expect(workItem).toBeDefined();
  });
};
