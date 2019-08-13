const {
  AddPractitionerFactory,
} = require('../../entities/caseAssociation/AddPractitionerFactory');
const {
  validateAddPractitioner,
} = require('./validateAddPractitionerInteractor');

describe('validateAddPractitioner', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateAddPractitioner({
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
    const errors = validateAddPractitioner({
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
