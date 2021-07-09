export const docketClerkSelectsWorkItems = cerebralTest => {
  return it('Docket clerk selects some work items', async () => {
    const unassignedWorkItem = cerebralTest
      .getState('workQueue')
      .find(
        workItem =>
          !workItem.assigneeId &&
          workItem.docketNumber === cerebralTest.docketNumber,
      );

    expect(unassignedWorkItem).toBeDefined();
    expect(cerebralTest.getState('selectedWorkItems').length).toEqual(0);
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem: unassignedWorkItem,
    });
    const selectedWorkItems = cerebralTest.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    cerebralTest.selectedWorkItem = selectedWorkItems[0];
  });
};
