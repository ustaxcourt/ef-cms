export default test => {
  return it('Docket clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    const workItem = test
      .getState('workQueue')
      .find(
        workItem => workItem.workItem === test.stipulatedDecisionWorkItemId,
      );
    expect(workItem).toBeUndefined();
  });
};
