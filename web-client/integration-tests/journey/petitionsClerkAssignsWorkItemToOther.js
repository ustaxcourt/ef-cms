export default test => {
  return it('Petitions clerk assigns work item to other user', async () => {
    // find the work item that is part of an Petition upload
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsMessages: false,
    });
    const sectionWorkItems = test.getState('workQueue');
    test.petitionWorkItemId = sectionWorkItems.find(
      item =>
        item.document.documentType === 'Petition' &&
        item.docketNumber === test.docketNumber,
    ).workItemId;

    // verify that there is an unassigned work item in the section queue; we will assign it
    const workItemToReassign = test
      .getState('workQueue')
      .find(
        workItem =>
          workItem.docketNumber === test.docketNumber &&
          workItem.workItemId === test.petitionWorkItemId,
      );
    expect(workItemToReassign).toBeDefined();
    expect(test.getState('selectedWorkItems').length).toEqual(0);

    // select that work item
    await test.runSequence('selectWorkItemSequence', {
      workItem: workItemToReassign,
    });
    const selectedWorkItems = test.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    test.selectedWorkItem = selectedWorkItems[0];

    // select an assignee
    expect(test.getState('assigneeId')).toBeNull();
    await test.runSequence('selectAssigneeSequence', {
      assigneeId: '4805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk1',
    });
    expect(test.getState('assigneeId')).toBeDefined();

    // assign that work item to the current user
    await test.runSequence('assignSelectedWorkItemsSequence');

    // should clear the selected work items
    expect(test.getState('selectedWorkItems').length).toEqual(0);

    // should have updated the work item in the section queue to have an assigneeId

    const sectionWorkQueue = test.getState('workQueue');
    const assignedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === test.petitionWorkItemId,
    );
    expect(assignedWorkItem).toMatchObject({
      assigneeId: '4805d1ab-18d0-43ec-bafb-654e83405416',
      section: 'petitions',
    });

    // the work item should be removed from the individual work queue
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsMessages: false,
    });
    const workQueue = test.getState('workQueue');
    const movedWorkItem = workQueue.find(
      workItem => workItem.workItemId === test.petitionWorkItemId,
    );
    expect(movedWorkItem).toBeUndefined();
  });
};
