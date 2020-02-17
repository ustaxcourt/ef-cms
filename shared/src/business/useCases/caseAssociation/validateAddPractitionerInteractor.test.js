const {
  AddPractitionerFactory,
} = require('../../entities/caseAssociation/AddPractitionerFactory');
const {
  validateAddPractitionerInteractor,
} = require('./validateAddPractitionerInteractor');

describe('validateAddPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          AddPractitionerFactory,
        }),
      },
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual(['user', 'representingPrimary']);
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          AddPractitionerFactory,
        }),
      },
      counsel: { representingPrimary: true, user: {} },
    });

    expect(errors).toEqual(null);
  });
});
