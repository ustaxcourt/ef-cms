const { validatePetition } = require('./validatePetition.interactor');

describe('validatePetition', () => {
  it('returns the expected errors object', () => {
    const errors = validatePetition({
      petition: {},
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
    });
    expect(errors).toEqual(null);
  });
});
