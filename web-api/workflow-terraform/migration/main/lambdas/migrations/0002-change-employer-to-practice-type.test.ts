import { migrateItems } from './0002-change-employer-to-practice-type';

describe('migrateItems', () => {
  it('should replace employer with practiceType for practitioners', async () => {
    const items = [
      {
        employer: 'Private',
        pk: 'user|1234',
        role: 'privatePractitioner',
      },
    ];
    const results = await migrateItems(items);
    expect(results).toEqual([
      {
        pk: 'user|1234',
        practiceType: 'Private',
        role: 'privatePractitioner',
      },
    ]);
  });

  it('should not alter user record if not practitioner', async () => {
    const items = [
      {
        pk: 'user|5678',
        role: 'petitioner',
      },
    ];
    const results = await migrateItems(items);
    expect(results).toEqual([
      {
        pk: 'user|5678',
        role: 'petitioner',
      },
    ]);
  });

  it('should not alter non user records', async () => {
    const items = [
      {
        pk: 'docket-entry|1234',
      },
    ];
    const results = await migrateItems(items);
    expect(results).toEqual([
      {
        pk: 'docket-entry|1234',
      },
    ]);
  });
});
