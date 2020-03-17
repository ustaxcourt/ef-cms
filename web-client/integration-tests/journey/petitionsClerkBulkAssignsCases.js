export default (test, createdCases) => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const selectedWorkItems = createdCases.map(newCase => {
      const firstDocketEntry = newCase.docketRecord.find(
        entry => entry.index === 1,
      );
      const firstDocument = newCase.documents.find(
        document => document.documentId === firstDocketEntry.documentId,
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
