const { applicationContext } = require('../test/createTestApplicationContext');
const { validatePetitionInteractor } = require('./validatePetitionInteractor');

describe('validatePetitionInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionInteractor({
      applicationContext,
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
    const errors = validatePetitionInteractor({
      applicationContext,
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
    const errors = validatePetitionInteractor({
      applicationContext,
      petition: {
        caseType: 'defined',
        filingType: 'defined',
        hasIrsNotice: true,
        partyType: 'defined',
        petitionFile: new File([], 'test.png'),
        petitionFileSize: 1,
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        stinFile: new File([], 'testStinFile.pdf'),
        stinFileSize: 1,
      },
    });
    expect(errors).toEqual(null);
  });
});
