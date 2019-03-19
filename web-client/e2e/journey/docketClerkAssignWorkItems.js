export default test => {
  return it('Docket clerk assigns the selected work items to another user', async () => {
    expect(test.getState('selectedWorkItems').length).toEqual(1);
    let sectionWorkQueue = test.getState('workQueue');
    let selectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === test.selectedWorkItem.workItemId,
    );
    expect(selectedWorkItem).toMatchObject({
      assigneeId: null,
    });

    await test.runSequence('assignSelectedWorkItemsSequence');

    sectionWorkQueue = test.getState('workQueue');
    selectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === test.selectedWorkItem.workItemId,
    );
    expect(sectionWorkQueue.length).toBeGreaterThanOrEqual(2);
    expect(selectedWorkItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
};
