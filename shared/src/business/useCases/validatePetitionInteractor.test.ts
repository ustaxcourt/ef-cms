const { applicationContext } = require('../test/createTestApplicationContext');
const { COUNTRY_TYPES, PARTY_TYPES } = require('../entities/EntityConstants');
const { validatePetitionInteractor } = require('./validatePetitionInteractor');

describe('validatePetitionInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'filingType',
      'hasIrsNotice',
      'partyType',
      'petitionFile',
      'preferredTrialCity',
      'procedureType',
      'stinFile',
    ]);
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {
        caseType: 'defined',
        hasIrsNotice: true,
        petitionFile: new File([], 'test.png'),
        petitionFileSize: 1,
        stinFile: new File([], 'test.png'),
        stinFileSize: 1,
      },
    });
    expect(Object.keys(errors)).toEqual([
      'filingType',
      'partyType',
      'preferredTrialCity',
      'procedureType',
    ]);
  });

  it('returns the expected errors object', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {
        caseType: 'defined',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File([], 'test.png'),
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Regular',
        stinFile: new File([], 'testStinFile.pdf'),
        stinFileSize: 1,
      },
    });
    expect(errors).toEqual(null);
  });
});
