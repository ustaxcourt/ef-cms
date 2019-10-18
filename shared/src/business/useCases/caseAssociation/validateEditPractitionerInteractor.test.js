const {
  EditPractitionerFactory,
} = require('../../entities/caseAssociation/EditPractitionerFactory');
const {
  validateEditPractitionerInteractor,
} = require('./validateEditPractitionerInteractor');

describe('validateEditPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateEditPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          EditPractitionerFactory,
        }),
      },
      practitioner: {},
    });

    expect(Object.keys(errors)).toEqual(['representingPrimary']);
  });

  it('returns null when no errors occur', () => {
    const errors = validateEditPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          EditPractitionerFactory,
        }),
      },
      practitioner: { representingPrimary: true },
    });

    expect(errors).toEqual(null);
  });
});
