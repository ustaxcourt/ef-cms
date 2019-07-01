export default test => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const selectedWorkItems = test.taxpayerNewCases.map(workItem => {
      return {
        workItemId: workItem.documents[0].workItems[0].workItemId,
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
