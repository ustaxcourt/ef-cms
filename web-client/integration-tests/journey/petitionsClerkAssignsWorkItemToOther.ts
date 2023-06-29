import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

export const petitionsClerkAssignsWorkItemToOther = cerebralTest => {
  return it('Petitions clerk assigns work item to other user', async () => {
    // find the work item that is part of an Petition upload
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const sectionWorkItems = cerebralTest.getState('workQueue');
    cerebralTest.petitionWorkItemId = sectionWorkItems.find(
      item =>
        item.docketEntry.documentType === 'Petition' &&
        item.docketNumber === cerebralTest.docketNumber,
    ).workItemId;

    // verify that there is an unassigned work item in the section queue; we will assign it
    const workItemToReassign = cerebralTest
      .getState('workQueue')
      .find(
        workItem =>
          workItem.docketNumber === cerebralTest.docketNumber &&
          workItem.workItemId === cerebralTest.petitionWorkItemId,
      );
    expect(workItemToReassign).toBeDefined();
    expect(cerebralTest.getState('selectedWorkItems').length).toEqual(0);

    // select that work item
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem: workItemToReassign,
    });
    const selectedWorkItems = cerebralTest.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    cerebralTest.selectedWorkItem = selectedWorkItems[0];

    // select an assignee
    expect(cerebralTest.getState('assigneeId')).toBeUndefined();
    await cerebralTest.runSequence('selectAssigneeSequence', {
      assigneeId: '4805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk1',
    });
    expect(cerebralTest.getState('assigneeId')).toBeDefined();

    // assign that work item to the current user
    await cerebralTest.runSequence('assignSelectedWorkItemsSequence');

    // should clear the selected work items
    expect(cerebralTest.getState('selectedWorkItems').length).toEqual(0);

    // should have updated the work item in the section queue to have an assigneeId

    const sectionWorkQueue = cerebralTest.getState('workQueue');
    const assignedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === cerebralTest.petitionWorkItemId,
    );
    expect(assignedWorkItem).toMatchObject({
      assigneeId: '4805d1ab-18d0-43ec-bafb-654e83405416',
      section: PETITIONS_SECTION,
    });

    // the work item should be removed from the individual work queue
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    const workQueue = cerebralTest.getState('workQueue');
    const movedWorkItem = workQueue.find(
      workItem => workItem.workItemId === cerebralTest.petitionWorkItemId,
    );
    expect(movedWorkItem).toBeUndefined();
  });
};
