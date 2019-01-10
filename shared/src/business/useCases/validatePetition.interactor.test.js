const { validatePetition } = require('./validatePetition.interactor');
const Petition = require('../entities/Petition');

describe('validatePetition', () => {
  it('returns the expected errors object', () => {
    const errors = validatePetition({
      petition: {},
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual({
      caseType: '"caseType" is required',
      procedureType: '"procedureType" is required',
      petitionFile: '"petitionFile" is required',
      preferredTrialCity: '"preferredTrialCity" is required',
    });
  });

  it('returns the expected errors object', () => {
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
      procedureType: '"procedureType" is required',
      petitionFile: '"petitionFile" is required',
      preferredTrialCity: '"preferredTrialCity" is required',
    });
  });

  it('returns the expected errors object', () => {
    const errors = validatePetition({
      petition: {
        caseType: 'defined',
        procedureType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
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
