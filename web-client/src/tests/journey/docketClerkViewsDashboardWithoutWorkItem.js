export default test => {
  return it('Docket clerk views dashboard without work item (since it was forward to the senior attorney)', async () => {
    await test.runSequence('gotoDashboardSequence');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === test.workItemId);
    expect(workItem).toBeUndefined();
  });
};
