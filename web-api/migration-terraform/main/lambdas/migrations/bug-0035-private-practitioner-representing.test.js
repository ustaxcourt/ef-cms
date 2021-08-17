const {
  migrateItems,
} = require('./bug-0035-private-practitioner-representing');
const {
  MOCK_PRACTITIONER,
} = require('../../../../../shared/src/test/mockUsers');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: 'case|999-99',
      sk: 'case|999-99',
    };

    documentClient = {
      delete: jest.fn().mockReturnValue({
        promise: () => {},
      }),
      get: () => ({
        promise: async () => ({
          Item: mockCaseItem,
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT case private practitioner records', async () => {
    const items = [
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'docket-entry|101-21',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'docket-entry|101-21',
      },
    ]);
  });

  it('should not modify private practitioner representing array if it only contains petitioners on the case', async () => {
    const items = [
      {
        pk: 'case|999-99',
        sk: 'privatePractitioner|d3989b49-dea9-4c1a-88fd-379b972032d8',
        ...MOCK_PRACTITIONER,
        representing: [MOCK_CASE.petitioners[0].contactId],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].representing).toEqual([
      MOCK_CASE.petitioners[0].contactId,
    ]);
  });

  it('should remove contactId from private practitioner representing array if that contactId does not map to a petitioner on the case', async () => {
    const items = [
      {
        pk: 'case|999-99',
        sk: 'privatePractitioner|d3989b49-dea9-4c1a-88fd-379b972032d8',
        ...MOCK_PRACTITIONER,
        representing: [
          MOCK_CASE.petitioners[0].contactId,
          'b147ae4b-9cb2-42da-8155-a8db5b307e48', // uuid for a petitioner that is not on the case
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].representing).toEqual([
      MOCK_CASE.petitioners[0].contactId,
    ]);
  });

  it('should remove private practitioner from case if representing array does not contain any petitioners on the case', async () => {
    const items = [
      {
        pk: 'case|999-99',
        sk: 'privatePractitioner|d3989b49-dea9-4c1a-88fd-379b972032d8',
        ...MOCK_PRACTITIONER,
        representing: [
          'b147ae4b-9cb2-42da-8155-a8db5b307e48', // uuid for a petitioner that is not on the case
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
    expect(documentClient.delete.mock.calls[0][0].Key).toEqual({
      pk: `user|${MOCK_PRACTITIONER.userId}`,
      sk: items[0].pk,
    });
  });

  it('should remove private practitioner from case if representing array is empty', async () => {
    const items = [
      {
        pk: 'case|999-99',
        sk: 'privatePractitioner|d3989b49-dea9-4c1a-88fd-379b972032d8',
        ...MOCK_PRACTITIONER,
        representing: [],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
    expect(documentClient.delete.mock.calls[0][0].Key).toEqual({
      pk: `user|${MOCK_PRACTITIONER.userId}`,
      sk: items[0].pk,
    });
  });
});
