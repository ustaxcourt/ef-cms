const {
  validCorrespondence,
} = require('../../../../../shared/src/business/entities/Correspondence.test');
const { migrateItems } = require('./0020-add-entity-name-for-correspondences');

describe('migrateItems', () => {
  let documentClient;

  const MOCK_CORRESPONDENCE_RECORD = {
    ...validCorrespondence,
    pk: 'case|101-20',
    sk: 'correspondence|baf86693-588c-45df-bfa6-995dc38fdba9',
  };

  beforeEach(() => {});

  it('should return and not modify records that are NOT correspondence records', async () => {
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

  it('should return and not modify records that are correspondence records and have an entity name', async () => {
    const items = [
      { ...MOCK_CORRESPONDENCE_RECORD, entityName: 'Correspondence' },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...MOCK_CORRESPONDENCE_RECORD,
          entityName: 'Correspondence',
        }),
      ]),
    );
  });

  it('should add entityName to correspondence records that do not already have an entityName', async () => {
    const items = [MOCK_CORRESPONDENCE_RECORD];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...MOCK_CORRESPONDENCE_RECORD,
          entityName: 'Correspondence',
        }),
      ]),
    );
  });
});
