const moment = require('moment');
const { CaseExternal } = require('../entities/cases/CaseExternal');
const { omit } = require('lodash');
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

    expect(errors).toEqual({
      ...omit(CaseExternal.errorToMessageMap, [
        'ownershipDisclosureFile',
        'ownershipDisclosureFileSize',
        'irsNoticeDate',
        'caseType',
        'petitionFileSize',
        'stinFileSize',
      ]),
    });
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
    expect(errors).toEqual({
      ...omit(CaseExternal.errorToMessageMap, [
        'caseType',
        'hasIrsNotice',
        'ownershipDisclosureFile',
        'ownershipDisclosureFileSize',
        'petitionFile',
        'petitionFileSize',
        'stinFile',
        'stinFileSize',
      ]),
      irsNoticeDate: 'Notice Date is a required field.',
    });
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

    expect(errors).toEqual({
      irsNoticeDate: 'Notice Date is in the future. Please enter a valid date.',
    });
  });
});
