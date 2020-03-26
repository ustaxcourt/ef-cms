import { Case } from '../../entities/cases/Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { addDocketEntryForPaymentStatus } from './serveCaseToIrsInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('addDocketEntryForPaymentStatus', () => {
  it('adds a docketRecord for a paid petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitionPaymentDate: 'Today',
        petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({ applicationContext, caseEntity });

    const addedDocketRecord = caseEntity.docketRecord.find(
      docketEntry => docketEntry.eventCode === 'FEE',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });

  it('adds a docketRecord for a waived petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        contactPrimary: undefined,
        documents: [],
        petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: 'Today',
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({ applicationContext, caseEntity });

    const addedDocketRecord = caseEntity.docketRecord.find(
      docketEntry => docketEntry.eventCode === 'FEEW',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });
});
