const {
  AddRespondent,
} = require('../../entities/caseAssociation/AddRespondent');
const { validateAddRespondent } = require('./validateAddRespondentInteractor');

describe('validateAddRespondent', () => {
  it('returns the expected errors object on an empty add respondent', () => {
    const errors = validateAddRespondent({
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
    const errors = validateAddRespondent({
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
