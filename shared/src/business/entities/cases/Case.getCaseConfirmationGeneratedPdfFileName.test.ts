import { Case } from './Case';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('getCaseConfirmationGeneratedPdfFileName', () => {
  it('generates the correct name for the case confirmation pdf', () => {
    const caseToVerify = new Case(
      {
        docketNumber: '123-20',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    );
    expect(caseToVerify.getCaseConfirmationGeneratedPdfFileName()).toEqual(
      'case-123-20-confirmation.pdf',
    );
  });
});
