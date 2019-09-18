export default test => {
  return it('Docket clerk views messages', async () => {
    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    const workItem = test
      .getState('workQueue')
      .find(
        workItem => workItem.workItem === test.stipulatedDecisionWorkItemId,
      );
    expect(workItem).toBeUndefined();
  });
};
