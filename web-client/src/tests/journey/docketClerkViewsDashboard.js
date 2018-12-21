export default test => {
  return it('Docket clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
  });
};
