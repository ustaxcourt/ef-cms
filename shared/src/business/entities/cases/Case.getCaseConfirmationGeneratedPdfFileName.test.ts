import { Case } from './Case';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('getCaseConfirmationGeneratedPdfFileName', () => {
  it('generates the correct name for the case confirmation pdf', () => {
    const caseToVerify = new Case(
      {
        docketNumber: '123-20',
      },
      {
        applicationContext,
      },
    );
    expect(caseToVerify.getCaseConfirmationGeneratedPdfFileName()).toEqual(
      'case-123-20-confirmation.pdf',
    );
  });
});
