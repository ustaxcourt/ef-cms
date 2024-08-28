import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { PAYMENT_STATUS } from '../../../../../shared/src/business/entities/EntityConstants';
import { addDocketEntryForPaymentStatus } from './serveCaseToIrsInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('addDocketEntryForPaymentStatus', () => {
  let user = mockPetitionerUser;

  it('adds a docketRecord for a paid petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitionPaymentDate: 'Today',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
      { authorizedUser: mockPetitionsClerkUser },
    );
    await addDocketEntryForPaymentStatus({
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
      { authorizedUser: mockPetitionsClerkUser },
    );
    await addDocketEntryForPaymentStatus({
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
