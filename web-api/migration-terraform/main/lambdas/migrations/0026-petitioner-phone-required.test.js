const {
  getContactPrimary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const { migrateItems } = require('./0026-petitioner-phone-required');
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

  it('should return and not modify petitioners that already have a phone', async () => {
    const unmodifiedItem = {
      ...MOCK_CASE, // has petitioners array with phone number
      pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const items = [unmodifiedItem];

    const results = await migrateItems(items);

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

    const results = await migrateItems(items);

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

    await expect(migrateItems(items)).rejects.toThrow(
      'The Petitioner entity was invalid.',
    );
  });
});
