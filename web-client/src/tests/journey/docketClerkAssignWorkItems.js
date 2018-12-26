export default test => {
  return it('Docket clerk assigns the selected work items to another user', async () => {
    expect(test.getState('selectedWorkItems').length).toEqual(1);
    let workQueue = test.getState('workQueue');
    let selectedWorkItem = workQueue.find(
      workItem => workItem.workItemId === test.selectedWorkItem.workItemId,
    );
    expect(selectedWorkItem).toMatchObject({
      assigneeId: null,
    });

    await test.runSequence('assignSelectedWorkItemsSequence');

    workQueue = test.getState('workQueue');
    selectedWorkItem = workQueue.find(
      workItem => workItem.workItemId === test.selectedWorkItem.workItemId,
    );
    expect(workQueue.length).toBeGreaterThanOrEqual(2);
    expect(selectedWorkItem).toMatchObject({
      assigneeId: 'docketclerk',
    });
  });
};
