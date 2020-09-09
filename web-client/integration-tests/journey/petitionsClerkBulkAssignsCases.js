export const petitionsClerkBulkAssignsCases = (test, createdCases) => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const selectedWorkItems = createdCases.map(newCase => {
      const firstDocument = newCase.docketEntries.find(
        entry => entry.index === 1,
      );

      return {
        workItemId: firstDocument.workItem.workItemId,
      };
    });

    const currentUserId = test.getState('user').userId;

    test.setState('assigneeId', currentUserId);
    test.setState('assigneeName', 'Petitions Clerk1');
    test.setState('selectedWorkItems', selectedWorkItems);

    const result = await test.runSequence('assignSelectedWorkItemsSequence');

    const { workQueue } = result.state;
    selectedWorkItems.forEach(assignedWorkItem => {
      const workItem = workQueue.find(
        item => (item.workItemId = assignedWorkItem.workItemId),
      );

      expect(workItem.assigneeId).toEqual(currentUserId);
    });
  });
};
