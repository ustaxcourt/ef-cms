const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
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
const { migrateItems } = require('./0025-add-contacts-to-petitioners-array');
const { omit } = require('lodash');

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

  it('should add contactSecondary to the petitioners array when the item is a case record', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        contactPrimary: {
          ...getContactPrimary(MOCK_CASE),
          contactType: undefined,
        },
        contactSecondary: {
          ...getContactPrimary(MOCK_CASE),
          contactType: undefined,
        },
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: undefined,
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contactPrimary).toBeUndefined();
    expect(results[0].contactSecondary).toBeUndefined();
    expect(results[0].petitioners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.primary,
        }),
        expect.objectContaining({
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.secondary,
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

  it('should populate the petitioners array with otherPetitioners and otherFilers when they already exist in item.petitioners with a contactType', async () => {
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

  it("should populate the petitioners array with otherPetitioners and otherFilers when they don't exist in the petitioners array and do not have a contactType", async () => {
    const mockOtherFilerWithoutContactType = omit(
      getOtherFilers(MOCK_CASE_WITH_SECONDARY_OTHERS)[0],
      'contactType',
    );
    const mockOtherPetitionerWithoutContactType = omit(
      getOtherPetitioners(MOCK_CASE_WITH_SECONDARY_OTHERS)[0],
      'contactType',
    );
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: [mockOtherFilerWithoutContactType],
        otherPetitioners: [mockOtherPetitionerWithoutContactType],
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners.length).toBe(3);
    expect(results[0].petitioners).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...mockOtherFilerWithoutContactType,
          contactType: CONTACT_TYPES.otherFiler,
        }),
        expect.objectContaining({
          ...mockOtherPetitionerWithoutContactType,
          contactType: CONTACT_TYPES.otherPetitioner,
        }),
      ]),
    );
  });

  it('should not throw an error when attempting to set contactType for otherFilers when otherFilers is undefined', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: undefined,
        otherPetitioners: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            inCareOf: 'Myself',
            name: 'Test Petitioner3',
            otherFilerType: 'Tax Matters Partner',
            phone: '1234567',
            postalCode: '12345',
            state: 'TN',
            title: 'Tax Matters Partner',
          },
        ],
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    await expect(() => migrateItems(items)).not.toThrow();
  });

  it('should not throw an error when attempting to set contactType for otherPetitioners it is undefined', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        ...MOCK_CASE,
        otherFilers: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            inCareOf: 'Myself',
            name: 'Test other Filer',
            otherFilerType: 'Tax Matters Partner',
            phone: '1234567',
            postalCode: '12345',
            state: 'TN',
            title: 'Tax Matters Partner',
          },
        ],
        otherPetitioners: undefined,
        petitioners: [getContactPrimary(MOCK_CASE)],
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    await expect(() => migrateItems(items)).not.toThrow();
  });
});
