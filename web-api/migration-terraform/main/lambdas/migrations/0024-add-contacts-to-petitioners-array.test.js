const {
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  getContactPrimary,
  getOtherFilers,
  getOtherPetitioners,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../../../../shared/src/test/mockCase');
const { migrateItems } = require('./0024-add-contacts-to-petitioners-array');

describe('migrateItems', () => {
  it('should return and not modify records that are NOT cases', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should return and not modify records already have a petitioners array', async () => {
    const unmodifiedItem = {
      ...MOCK_CASE, // has petitioners array
      pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const items = [unmodifiedItem];

    const results = await migrateItems(items);

    expect(results[0].petitioners).toMatchObject(unmodifiedItem.petitioners);
    expect(results[0].contactPrimary).toBeUndefined();
  });

  it('should add contactPrimary to the petitioners array when the item is a case record', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        contactPrimary: {
          ...getContactPrimary(MOCK_CASE),
          contactType: undefined,
        },
        petitioners: undefined,
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contactPrimary).toBeUndefined();
    expect(results[0].petitioners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.primary,
        }),
      ]),
    );
  });

  it('should properly populate the petitioners array on a case when otherFilers is undefined', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: undefined,
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners.length).toBe(1);
  });

  it('should properly populate the petitioners array on a case when otherPetitioners is undefined', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: [getOtherFilers(MOCK_CASE_WITH_SECONDARY_OTHERS)[0]],
        otherPetitioners: undefined,
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners.length).toBe(2);
  });

  it('should populate the petitioners array with otherPetitioners and otherFilers when they exist', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: [...getOtherFilers(MOCK_CASE_WITH_SECONDARY_OTHERS)],
        otherPetitioners: [
          ...getOtherPetitioners(MOCK_CASE_WITH_SECONDARY_OTHERS),
        ],
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...getOtherPetitioners(MOCK_CASE_WITH_SECONDARY_OTHERS)[0],
          contactType: CONTACT_TYPES.otherPetitioner,
        }),
        expect.objectContaining({
          ...getOtherFilers(MOCK_CASE_WITH_SECONDARY_OTHERS)[0],
          contactType: CONTACT_TYPES.otherFiler,
        }),
      ]),
    );
    expect(results[0].petitioners.length).toBe(5);
  });
});
