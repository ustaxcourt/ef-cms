import { migrateItems } from './0008-add-assignee-id-gsi2pk-to-work-item';

describe('migrateItems', () => {
  it('should set a gsi2pk on the record when it is a work item with an assignee', async () => {
    const mockWorkItemWithAssignee = {
      assigneeId: 'fcb192d7-5779-43a2-9534-903f0914bb99',
      gsi2pk: undefined,
      pk: 'case|101-45',
      sk: 'work-item|164c6e1c-e4f6-456b-ac74-2ed7fd8045c2',
    };
    const mockWorkItemWithoutAssignee = {
      assigneeId: undefined,
      gsi2pk: undefined,
      pk: 'case|101-45',
      sk: 'work-item|813f09e6-075e-43f0-bf2d-a5a96950056d',
    };
    const records = [mockWorkItemWithAssignee, mockWorkItemWithoutAssignee];

    const migratedItems = await migrateItems(records);

    expect(migratedItems).toEqual([
      {
        ...mockWorkItemWithAssignee,
        gsi2pk: `assigneeId|${mockWorkItemWithAssignee.assigneeId}`,
      },
      mockWorkItemWithoutAssignee,
    ]);
  });

  it('should ignore records that are NOT work items', async () => {
    const mockCaseRecord = {
      docketNumber: '101-45',
      pk: 'case|101-45',
      sk: 'case|101-45',
    };

    const records = [mockCaseRecord];

    const migratedItems = await migrateItems(records);

    expect(migratedItems).toEqual([mockCaseRecord]);
  });
});
