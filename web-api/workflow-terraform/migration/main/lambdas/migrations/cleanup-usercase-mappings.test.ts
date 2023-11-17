import { migrateItems } from './cleanup-usercase-mappings';

describe('cleanup-usercase-mappings migration script', () => {
  it('should remove properties from UserCase mapping records that no longer exist, and leave all other records as is', () => {
    const items = [
      {
        docketNumber: '123-22',
        gsi1pk: 'user-case|123-22',
        pk: 'user|345',
        sk: 'case|123-22',
        trashProperty: 'THIS_SHOULD_GET_DELETED',
      },
      {
        anotherField: 'THIS_SHOULD_NOT_GET_DELETED',
        docketNumber: '123-22',
        pk: 'case|123-22',
        sk: 'case|123-22',
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([
      {
        docketNumber: '123-22',
        gsi1pk: 'user-case|123-22',
        pk: 'user|345',
        sk: 'case|123-22',
      },
      {
        anotherField: 'THIS_SHOULD_NOT_GET_DELETED',
        docketNumber: '123-22',
        pk: 'case|123-22',
        sk: 'case|123-22',
      },
    ]);
  });
});
