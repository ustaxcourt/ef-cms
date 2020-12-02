const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0005-eservice-indicator-has-eaccess');

describe('migrateItems', () => {
  let documentClient;

  const PRIMARY_CONTACT_ID = '31db3d83-23c2-4726-bff6-aaf61b7ce1b6';
  const SECONDARY_CONTACT_ID = 'bf99085c-ece1-4e34-a3b1-3b10669c4793';

  let mockCase;
  let mockCaseData = {
    contactPrimary: {
      contactId: PRIMARY_CONTACT_ID,
      hasEAccess: true,
    },
    contactSecondary: { contactId: SECONDARY_CONTACT_ID },
    docketNumber: '123-20',
    pk: 'case|123-20',
    sk: 'case|123-20',
  };

  beforeEach(() => {
    // bypassing obj reference shenanigans
    mockCase = JSON.parse(JSON.stringify(mockCaseData));
  });

  it('should only mutate case records', async () => {
    const contactPrimary = {
      hasEAccess: true,
      serviceIndicator: undefined,
    };

    const caseRecords = [
      {
        contactPrimary,
        pk: 'case|101-20',
        sk: 'case|101-20',
      },
      {
        contactPrimary,
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ];

    const nonCaseRecords = [
      {
        contactPrimary, // this would not normally be here - proving only case records will be migrated
        pk: 'docketEntry|123',
        sk: 'docketEntry|123',
      },
      {
        contactPrimary, // this would not normally be here - proving only case records will be migrated
        pk: 'case|101-20',
        sk: 'user|123',
      },
    ];

    const results = await migrateItems(
      [...caseRecords, ...nonCaseRecords],
      documentClient,
    );

    expect(results).toEqual([
      expect.objectContaining(caseRecords[0]),
      expect.objectContaining(caseRecords[1]),
    ]);
  });

  it('should set the serviceIndicator for contactPrimary', async () => {
    const results = await migrateItems([{ ...mockCase }], documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contactPrimary: expect.objectContaining({
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          }),
          pk: 'case|123-20',
          sk: 'case|123-20',
        }),
      ]),
    );
  });

  it('should set the serviceIndicator for contactSecondary', async () => {
    const results = await migrateItems(
      [
        {
          ...mockCase,
          contactPrimary: {
            ...mockCase.contactPrimary,
            hasEAccess: false,
          },
          contactSecondary: {
            ...mockCase.contactSecondary,
            hasEAccess: true,
          },
          docketNumber: '125-20',
          pk: 'case|125-20',
          sk: 'case|125-20',
        },
      ],
      documentClient,
    );

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contactPrimary: expect.not.objectContaining({
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          }),
          contactSecondary: expect.objectContaining({
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          }),
          pk: 'case|125-20',
          sk: 'case|125-20',
        }),
      ]),
    );
  });

  it('should set the serviceIndicator for contactPrimary and contactSecondary', async () => {
    const results = await migrateItems(
      [
        {
          ...mockCase,
          contactSecondary: {
            ...mockCase.contactSecondary,
            hasEAccess: true,
          },
          docketNumber: '124-20',
          pk: 'case|124-20',
          sk: 'case|124-20',
        },
      ],
      documentClient,
    );

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contactPrimary: expect.objectContaining({
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          }),
          contactSecondary: expect.objectContaining({
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          }),
          pk: 'case|124-20',
          sk: 'case|124-20',
        }),
      ]),
    );
  });
});
