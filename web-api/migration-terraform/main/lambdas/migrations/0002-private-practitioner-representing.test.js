const {
  ROLES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0002-private-practitioner-representing');

describe('migrateItems', () => {
  let documentClient;
  const PRIMARY_CONTACT_ID = '31db3d83-23c2-4726-bff6-aaf61b7ce1b6';
  const SECONDARY_CONTACT_ID = 'bf99085c-ece1-4e34-a3b1-3b10669c4793';

  const mockPrivatePractitionerCaseRecord = {
    barNumber: '12345',
    name: 'Bob Barker',
    pk: 'case|123-20',
    representingPrimary: true,
    representingSecondary: true,
    role: ROLES.privatePractitioner,
    sk: 'privatePractitioner|4de7a43d-0506-4431-9aab-b90e36aa8b5a',
    userId: '4de7a43d-0506-4431-9aab-b90e36aa8b5a',
  };

  const mockCase = {
    contactPrimary: { contactId: PRIMARY_CONTACT_ID },
    contactSecondary: { contactId: SECONDARY_CONTACT_ID },
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

  it('should return and not modify records that are not private practitioner case records', async () => {
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

  it('should return modified private practitioner case record with representing array set', async () => {
    const items = [{ ...mockPrivatePractitionerCaseRecord }];

    const results = await migrateItems(items, documentClient);

    expect(results).toMatchObject([
      {
        ...mockPrivatePractitionerCaseRecord,
        representing: [PRIMARY_CONTACT_ID, SECONDARY_CONTACT_ID],
      },
    ]);
  });

  it('should throw an error if a case record is not found for the private practitioner case record', async () => {
    const items = [{ ...mockPrivatePractitionerCaseRecord }];

    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: {},
        }),
      }),
    };

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      `Case record ${mockPrivatePractitionerCaseRecord.docketNumber} was not found`,
    );
  });

  it('should not overwrite representing array contents if one is already set on the private practitioner case record', async () => {
    const items = [
      {
        ...mockPrivatePractitionerCaseRecord,
        representing: ['b8255f65-7e75-4523-9c08-c13fb39cfb61'],
        representingPrimary: true,
        representingSecondary: false,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      representing: [
        'b8255f65-7e75-4523-9c08-c13fb39cfb61',
        PRIMARY_CONTACT_ID,
      ],
    });
  });

  it('should not add primary or secondary contact id to representing array if they are already present', async () => {
    const items = [
      {
        ...mockPrivatePractitionerCaseRecord,
        representing: [PRIMARY_CONTACT_ID, SECONDARY_CONTACT_ID],
        representingPrimary: true,
        representingSecondary: true,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      representing: [PRIMARY_CONTACT_ID, SECONDARY_CONTACT_ID],
    });
  });

  it('should not modify the record if representingPrimary and representingSecondary are false', async () => {
    const items = [
      {
        ...mockPrivatePractitionerCaseRecord,
        representing: ['b8255f65-7e75-4523-9c08-c13fb39cfb61'],
        representingPrimary: false,
        representingSecondary: false,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      representing: ['b8255f65-7e75-4523-9c08-c13fb39cfb61'],
    });
  });

  it('should create representing array if one does not already exist on the record', async () => {
    const items = [
      {
        ...mockPrivatePractitionerCaseRecord,
        representing: undefined,
        representingPrimary: false,
        representingSecondary: true,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      representing: [SECONDARY_CONTACT_ID],
    });
  });
});
