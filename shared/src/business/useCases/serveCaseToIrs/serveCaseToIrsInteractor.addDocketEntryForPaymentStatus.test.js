const {
  addDocketEntryForPaymentStatus,
} = require('./serveCaseToIrsInteractor');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { PAYMENT_STATUS } = require('../../entities/EntityConstants');

describe('addDocketEntryForPaymentStatus', () => {
  let user;

  beforeEach(() => {
    user = applicationContext.getCurrentUser();
  });

  it('adds a docketRecord for a paid petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitionPaymentDate: 'Today',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({
      applicationContext,
      caseEntity,
      user,
    });

    const addedDocketRecord = caseEntity.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'FEE',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });

  it('adds a docketRecord for a waived petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [],
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: 'Today',
        petitioners: undefined,
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({
      applicationContext,
      caseEntity,
      user,
    });

    const addedDocketRecord = caseEntity.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'FEEW',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });
});
