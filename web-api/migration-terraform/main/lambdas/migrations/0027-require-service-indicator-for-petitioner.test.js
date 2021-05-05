const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  getContactPrimary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  migrateItems,
} = require('./0027-require-service-indicator-for-petitioner');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;
  let mockCaseItem;
  let mockCaseRecords;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: 'case|999-99',
      sk: 'case|999-99',
    };
    mockCaseRecords = [
      mockCaseItem,
      {
        archived: false,
        docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        pk: 'case|123-20',
        sk: 'docket-entry|124',
        userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
      },
    ];

    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      }),
    };
  });

  it('should not update records that are NOT case records', async () => {
    const items = [
      {
        pk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(items);
  });

  it('should set serviceIndicator when a petitioner on a case does NOT have one specified', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE,
        petitioners: [
          { ...getContactPrimary(MOCK_CASE), serviceIndicator: undefined },
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(getContactPrimary(results[0]).serviceIndicator).not.toBeUndefined();
  });

  it('should validate case records after updating serviceIndicators', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE,
        docketNumber: undefined,
        petitioners: [
          { ...getContactPrimary(MOCK_CASE), serviceIndicator: undefined },
        ],
      },
    ];

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      'The Case entity was invalid. {"docketNumber":"\'docketNumber\' is required","sortableDocketNumber":"\'sortableDocketNumber\' is required"}',
    );
  });

  it('should validate case records with invalid petitioner', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: undefined,
            name: undefined,
            serviceIndicator: undefined,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: items,
        }),
      }),
    };

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      'The Case entity was invalid. null',
    );
  });

  it('should return and not modify petitioners that already have a phone', async () => {
    const unmodifiedItem = {
      ...MOCK_CASE, // has petitioners array with phone number
      pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const items = [unmodifiedItem];
    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: items,
        }),
      }),
    };

    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[0]).toMatchObject(MOCK_CASE.petitioners[0]);
  });

  it('should set N/A for the petitioners phone when it is not defined', async () => {
    const itemsToModify = {
      ...MOCK_CASE,
      petitioners: [{ ...getContactPrimary(MOCK_CASE), phone: undefined }],
      pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const items = [itemsToModify];
    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: items,
        }),
      }),
    };
    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[0].phone).toBe('N/A');
  });

  it('should throw an error for invalid petitioners', async () => {
    const itemsToModify = {
      ...MOCK_CASE,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          address1: undefined,
          phone: undefined,
        },
      ],
      pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const items = [itemsToModify];
    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: items,
        }),
      }),
    };
    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      'The Petitioner entity was invalid.',
    );
  });
});
