import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

export const petitionsClerkAssignsWorkItemToSelf = cerebralTest => {
  return it('Petitions clerk assigns work item to self', async () => {
    // find the work item that is part of an Petition upload
    const sectionWorkItems = cerebralTest.getState('workQueue');
    cerebralTest.petitionWorkItemId = sectionWorkItems.find(
      item =>
        item.docketEntry.documentType === 'Petition' &&
        item.docketNumber === cerebralTest.docketNumber,
    ).workItemId;

    // verify that there is an unassigned work item in the section queue; we will assign it
    const unassignedWorkItem = cerebralTest
      .getState('workQueue')
      .find(
        workItem =>
          !workItem.assigneeId &&
          workItem.docketNumber === cerebralTest.docketNumber &&
          workItem.workItemId === cerebralTest.petitionWorkItemId,
      );
    expect(unassignedWorkItem).toBeDefined();
    expect(cerebralTest.getState('selectedWorkItems').length).toEqual(0);

    // select that work item
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem: unassignedWorkItem,
    });
    const selectedWorkItems = cerebralTest.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    cerebralTest.selectedWorkItem = selectedWorkItems[0];
    expect(unassignedWorkItem).toMatchObject({
      assigneeId: null,
    });

    // select an assignee
    expect(cerebralTest.getState('assigneeId')).toBeNull();
    await cerebralTest.runSequence('selectAssigneeSequence', {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
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
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      section: PETITIONS_SECTION,
    });

    // the work item should appear in the individual work queue
    const workQueue = cerebralTest.getState('workQueue');
    const movedWorkItem = workQueue.find(
      workItem => workItem.workItemId === cerebralTest.petitionWorkItemId,
    );
    expect(movedWorkItem).toMatchObject({
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      section: PETITIONS_SECTION,
    });
  });
};
