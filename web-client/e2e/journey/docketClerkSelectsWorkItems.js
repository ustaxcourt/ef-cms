export default test => {
  return it('Docket clerk selects some work items', async () => {
    const unassignedWorkItem = test
      .getState('sectionWorkQueue')
      .find(
        workItem =>
          !workItem.assigneeId &&
          workItem.docketNumber === test.docketNumber &&
          workItem.workItemId === test.stipulatedDecisionWorkItemId,
      );
    expect(unassignedWorkItem).toBeDefined();
    expect(test.getState('selectedWorkItems').length).toEqual(0);
    await test.runSequence('selectWorkItemSequence', {
      workItem: unassignedWorkItem,
    });
    const selectedWorkItems = test.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    test.selectedWorkItem = selectedWorkItems[0];
  });
};
