const {
  PAYMENT_STATUS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0001-filing-fee-text-casing');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  it('should not update items that are not a Case record', async () => {
    const items = [
      {
        pk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
        sk: 'user|ae3aff09-1e2e-43d0-a6bf-d43e2e4e0ff9',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it("should only update items to have new payment status when they are a Case record with payment status 'not paid", async () => {
    const items = [
      {
        ...MOCK_CASE,
        petitionPaymentStatus: 'Not Paid',
        pk: 'case|654-23',
        sk: 'case|654-23',
      },
      {
        ...MOCK_CASE,
        petitionPaymentDate: '2020-12-01T00:00:00.000Z',
        petitionPaymentMethod: 'money',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        pk: 'case|655-23',
        sk: 'case|655-23',
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitionPaymentStatus).toEqual(PAYMENT_STATUS.UNPAID);
    expect(results[1].petitionPaymentStatus).toEqual(PAYMENT_STATUS.PAID);
  });

  it('should validate migrated Case records', async () => {
    const items = [
      {
        ...MOCK_CASE,
        docketNumber: undefined,
        petitionPaymentStatus: 'Not Paid',
        pk: 'case|654-23',
        sk: 'case|654-23',
      },
    ];

    await expect(migrateItems(items)).rejects.toThrow(
      'The Case entity was invalid.',
    );
  });
});
