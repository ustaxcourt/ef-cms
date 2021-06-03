const { migrateItems } = require('./0027-delete-work-item-records');

describe('migrateItems', () => {
  it('should not delete records that are not work items', async () => {
    const items = [
      {
        pk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should not delete main work item records', async () => {
    const items = [
      {
        pk: 'work-item|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'work-item|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should delete work item user inbox records', async () => {
    const items = [
      {
        pk: 'user|f9dcaebd-b603-4510-b8ec-4afea07a4312',
        sk: 'work-item|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([]);
  });

  it('should delete work item section inbox records', async () => {
    const items = [
      {
        pk: 'section|docket',
        sk: 'work-item|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([]);
  });
});
