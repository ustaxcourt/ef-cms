const { validatePetition } = require('./validatePetition.interactor');
const Petition = require('../entities/Petition');
const { omit } = require('lodash');
const moment = require('moment');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetition({
      petition: {},
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual(Petition.errorToMessageMap);
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetition({
      petition: {
        caseType: 'defined',
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual(omit(Petition.errorToMessageMap, ['caseType']));
  });

  it('returns the expected errors object', () => {
    const errors = validatePetition({
      petition: {
        caseType: 'defined',
        procedureType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        irsNoticeDate: new Date().toISOString(),
        irsNoticeFile: new File([], 'test.png'),
        signature: true,
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns an error for a irs notice date in the future', () => {
    const futureDate = moment().add(1, 'days');

    const errors = validatePetition({
      petition: {
        caseType: 'defined',
        procedureType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        irsNoticeDate: futureDate.toDate().toISOString(),
        irsNoticeFile: new File([], 'test.png'),
        signature: true,
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });

    expect(errors).toEqual({
      irsNoticeDate: 'IRS Notice Date is a required field.',
    });
  });
});
