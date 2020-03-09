export default test => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const selectedWorkItems = test.petitionerNewCases.map(newCase => {
      const firstDocument = newCase.documents.reduce((prev, current) =>
        prev.createdAt < current.createdAt ? prev : current,
      );

      return {
        workItemId: firstDocument.workItems[0].workItemId,
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
