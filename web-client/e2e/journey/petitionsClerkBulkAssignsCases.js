export default test => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const newWorkItemId =
      test.taxpayerNewCase.documents[0].workItems[0].workItemId;

    const currentUserId = test.getState('user').userId;

    test.setState('assigneeId', currentUserId);
    test.setState('assigneeName', 'Petitions Clerk1');
    test.setState('selectedWorkItems', [
      {
        workItemId: newWorkItemId,
      },
    ]);

    const result = await test.runSequence('assignSelectedWorkItemsSequence');

    const workQueue = result.state.workQueue;
    const workItem = workQueue.find(item => (item.workItemId = newWorkItemId));

    expect(workItem.assigneeId).toEqual(currentUserId);
  });
};
