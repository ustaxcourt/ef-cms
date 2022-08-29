const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateStartCaseWizardInteractor,
} = require('./validateStartCaseWizardInteractor');
const { COUNTRY_TYPES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('validateStartCaseWizardInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validateStartCaseWizardInteractor(applicationContext, {
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'wizardStep',
      'stinFile',
      'hasIrsNotice',
      'petitionFile',
      'filingType',
      'partyType',
      'preferredTrialCity',
      'procedureType',
    ]);
  });

  it('returns null for a valid petition', () => {
    const errors = validateStartCaseWizardInteractor(applicationContext, {
      petition: {
        ...MOCK_CASE,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Primary',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        hasIrsNotice: true,
        petitionFile: new File([], 'test.pdf'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.pdf'),
        stinFileSize: 1,
        wizardStep: '4',
      },
    });

    expect(errors).toEqual(null);
  });
});
