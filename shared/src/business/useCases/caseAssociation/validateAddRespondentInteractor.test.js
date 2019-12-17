const {
  AddRespondent,
} = require('../../entities/caseAssociation/AddRespondent');
const {
  validateAddRespondentInteractor,
} = require('./validateAddRespondentInteractor');

describe('validateAddRespondentInteractor', () => {
  it('returns the expected errors object on an empty add respondent', () => {
    const errors = validateAddRespondentInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          AddRespondent,
        }),
      },
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(AddRespondent.VALIDATION_ERROR_MESSAGES),
    );
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddRespondentInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          AddRespondent,
        }),
      },
      counsel: { representingPrimary: true, user: {} },
    });

    expect(errors).toEqual(null);
  });
});
