import { Case } from '../../entities/cases/Case';
import { DocketRecord } from '../../entities/DocketRecord';
import { MOCK_CASE } from '../../../test/mockCase';
import { addDocketEntryForPaymentStatus } from './serveCaseToIrsInteractor';

describe('addDocketEntryForPaymentStatus', () => {
  let applicationContext;
  let caseEntity;

  beforeEach(() => {
    applicationContext = {
      getCurrentUser: () => ({
        role: 'petitioner',
      }),
      getEntityConstructors: () => ({
        Case,
        DocketRecord,
      }),
    };

    caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitionPaymentDate: 'Today',
        petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
      },
      { applicationContext },
    );
  });

  it('adds a docketRecord for a paid petition payment', async () => {
    await addDocketEntryForPaymentStatus({ applicationContext, caseEntity });

    const addedDocketRecord = caseEntity.docketRecord.find(
      docketEntry => docketEntry.eventCode === 'FEE',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });

  it('adds a docketRecord for a waived petition payment', async () => {
    caseEntity = new Case(
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
