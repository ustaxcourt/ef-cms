export default test => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    const { workItemId } = test.taxpayerNewCases[0].documents[0].workItems[0];

    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
