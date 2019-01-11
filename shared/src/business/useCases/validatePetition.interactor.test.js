const { validatePetition } = require('./validatePetition.interactor');
const Petition = require('../entities/Petition');

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
    expect(errors).toEqual({
      caseType: 'Case Type is a required field.',
      irsNoticeDate: 'IRS Notice Date is a required field.',
      irsNoticeFile: 'The IRS Notice file was not selected.',
      petitionFile: 'The Petition file was not selected.',
      preferredTrialCity: 'Preferred Trial City is a required field.',
      procedureType: 'Procedure Type is a required field.',
    });
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
    expect(errors).toEqual({
      irsNoticeDate: 'IRS Notice Date is a required field.',
      irsNoticeFile: 'The IRS Notice file was not selected.',
      petitionFile: 'The Petition file was not selected.',
      preferredTrialCity: 'Preferred Trial City is a required field.',
      procedureType: 'Procedure Type is a required field.',
    });
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
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual(null);
  });
});
