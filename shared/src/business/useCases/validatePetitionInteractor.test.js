const { validatePetition } = require('./validatePetitionInteractor');
const { Petition } = require('../entities/Petition');
const { omit } = require('lodash');
const moment = require('moment');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetition({
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
      petition: {},
    });

    expect(errors).toEqual({
      ...omit(Petition.errorToMessageMap, [
        'ownershipDisclosureFile',
        'irsNoticeDate',
        'caseType',
      ]),
    });
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetition({
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
      petition: {
        caseType: 'defined',
        hasIrsNotice: true,
      },
    });
    expect(errors).toEqual({
      ...omit(Petition.errorToMessageMap, [
        'caseType',
        'hasIrsNotice',
        'ownershipDisclosureFile',
      ]),
      irsNoticeDate: 'Notice Date is a required field.',
    });
  });

  it('returns the expected errors object', () => {
    const errors = validatePetition({
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
      petition: {
        caseType: 'defined',
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
        stinFile: {},
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns an error for a irs notice date in the future', () => {
    const futureDate = moment().add(1, 'days');

    const errors = validatePetition({
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
      petition: {
        caseType: 'defined',
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: futureDate.toDate().toISOString(),
        partyType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
        stinFile: {},
      },
    });

    expect(errors).toEqual({
      irsNoticeDate: 'Notice Date is in the future. Please enter a valid date.',
    });
  });
});
