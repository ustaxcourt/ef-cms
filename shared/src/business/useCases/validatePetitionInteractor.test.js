const moment = require('moment');
const { CaseExternal } = require('../entities/cases/CaseExternal');
const { validatePetitionInteractor } = require('./validatePetitionInteractor');

describe('validatePetitionInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseExternal,
        }),
      },
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'filingType',
      'hasIrsNotice',
      'partyType',
      'petitionFile',
      'preferredTrialCity',
      'procedureType',
      'signature',
      'stinFile',
    ]);
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetitionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseExternal,
        }),
      },
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
      'irsNoticeDate',
      'partyType',
      'preferredTrialCity',
      'procedureType',
      'signature',
    ]);
  });

  it('returns the expected errors object', () => {
    const errors = validatePetitionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseExternal,
        }),
      },
      petition: {
        caseType: 'defined',
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'defined',
        petitionFile: new File([], 'test.png'),
        petitionFileSize: 1,
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
        stinFile: new File([], 'testStinFile.pdf'),
        stinFileSize: 1,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns an error for a irs notice date in the future', () => {
    const futureDate = moment().add(1, 'days');

    const errors = validatePetitionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          CaseExternal,
        }),
      },
      petition: {
        caseType: 'defined',
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: futureDate.toDate().toISOString(),
        partyType: 'defined',
        petitionFile: new File([], 'test.png'),
        petitionFileSize: 1,
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
        stinFile: new File([], 'testStinFile.pdf'),
        stinFileSize: 1,
      },
    });

    expect(Object.keys(errors)).toEqual(['irsNoticeDate']);
  });
});
