const {
  validCorrespondence,
} = require('../../../../../shared/src/business/entities/Correspondence');
const { migrateItems } = require('./0018-add-entity-name');

describe('migrateItems', () => {
  let documentClient;

  const MOCK_CORRESPONDENCE_RECORD = {
    ...validCorrespondence,
    pk: 'case|101-20',
    sk: 'correspondence|baf86693-588c-45df-bfa6-995dc38fdba9',
  };

  beforeEach(() => {});

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should add entityName to correspondence records that do not already have an entityName', async () => {
    const items = [MOCK_CORRESPONDENCE_RECORD];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      { ...MOCK_CORRESPONDENCE_RECORD, entityName: 'Correspondence' },
    ]);
  });

  it.skip('should migrate case records and remove fields not stored in persistence', async () => {
    const items = [MOCK_CASE_RECORD];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toEqual({
      ...MOCK_CASE_RECORD,
      archivedCorrespondences: undefined,
      archivedDocketEntries: undefined,
      correspondence: undefined,
      docketEntries: undefined,
      hearings: undefined,
      irsPractitioners: undefined,
      privatePractitioners: undefined,
    });
  });

  it.skip('should throw an error if the case record is invalid after removing fields not stored in persistence', async () => {
    const items = [{ ...MOCK_CASE_RECORD, partyType: undefined }];

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      'The Case entity was invalid. {"partyType":"\'partyType\' is required"}',
    );
  });
});
