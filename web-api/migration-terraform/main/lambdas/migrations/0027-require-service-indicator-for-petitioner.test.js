const {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  migrateItems,
} = require('./0027-require-service-indicator-for-petitioner');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  it('should not update records that are NOT case records', async () => {
    const items = [
      {
        pk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should NOT change serviceIndicator when a petitioner on a case already has one specified', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        ...MOCK_CASE,
        petitioners: [
          { ...getContactPrimary(MOCK_CASE), serviceIndicator: undefined },
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.secondary,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          },
        ],
      },
    ];

    const results = await migrateItems(items);

    expect(getContactSecondary(results[0]).serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('should default serviceIndicator to "None" when a petitioner on a case does NOT have one specified', async () => {
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

    const results = await migrateItems(items);

    expect(getContactPrimary(results[0]).serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
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

    await expect(migrateItems(items)).rejects.toThrow('');
  });
});
