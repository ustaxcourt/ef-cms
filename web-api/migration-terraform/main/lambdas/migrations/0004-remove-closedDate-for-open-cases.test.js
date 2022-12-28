import { migrateItems } from './0004-remove-closedDate-for-open-cases';

describe('migrateItems', () => {
  it('should return and not modify records that are NOT case records', async () => {
    const mockItems = [
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'trial-session|87b86617-f090-4f26-a321-3ee0683cc0f2',
        sk: 'trial-session|87b86617-f090-4f26-a321-3ee0683cc0f2',
      },
    ];
    const results = await migrateItems(mockItems);

    expect(results).toEqual(mockItems);
  });
});
