const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0001-user-case-add-closed-date');

describe('migrateItems', () => {
  let documentClient;
  const USER_CASE_ID = '31db3d83-23c2-4726-bff6-aaf61b7ce1b6';
  const mockClosedDate = '2020-11-11T22:22:22.021Z';

  const mockUserCase = {
    caseCaption: 'A Case for Tests',
    createdAt: '2019-03-01T21:42:29.073Z',
    docketNumber: '123-20',
    docketNumberWithSuffix: '123-20L',
    gsi1pk: `user-case|${USER_CASE_ID}`,
    pk: `user|${USER_CASE_ID}`,
    sk: `case|${USER_CASE_ID}`,
    status: CASE_STATUS_TYPES.closed,
  };

  const mockCase = {
    closedDate: mockClosedDate,
    docketNumber: '123-20',
    pk: 'case|123-20',
    sk: 'case|123-20',
  };

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: mockCase,
        }),
      }),
    };
  });

  it('should return and not modify records that are not UserCase records', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
      {
        gsi1pk: 'eligible-for-trial-case-catalog|123-20',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          gsi1pk:
            'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
          pk: 'eligible-for-trial-case-catalog',
          sk: 'eligible-for-trial-case-catalog',
        },
        {
          gsi1pk: 'eligible-for-trial-case-catalog|123-20',
          pk: 'eligible-for-trial-case-catalog',
          sk: 'eligible-for-trial-case-catalog',
        },
      ]),
    );
  });

  it('should return modified UserCase record with closedDate set', async () => {
    const items = [{ ...mockUserCase }];

    const results = await migrateItems(items, documentClient);

    expect(results).toMatchObject([
      {
        ...mockUserCase,
        closedDate: mockClosedDate,
      },
    ]);
  });

  it('should throw an error if a case record is not found for the user-case', async () => {
    const items = [{ ...mockUserCase }];

    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: {},
        }),
      }),
    };

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      `Case record ${mockUserCase.docketNumber} was not found`,
    );
  });

  it('should not overwrite closedDate if one is already set on the UserCase', async () => {
    const items = [{ ...mockUserCase, closedDate: '2002-03-15T22:22:22.021Z' }];

    const results = await migrateItems(items, documentClient);

    expect(results.closedDate).not.toBe(mockClosedDate);
  });
});
