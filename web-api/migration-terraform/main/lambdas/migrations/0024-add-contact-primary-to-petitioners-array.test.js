const {
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  getContactPrimary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  migrateItems,
} = require('./0024-add-contact-primary-to-petitioners-array');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

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
});
