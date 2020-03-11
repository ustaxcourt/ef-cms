const {
  EditPrivatePractitionerFactory,
} = require('../../entities/caseAssociation/EditPrivatePractitionerFactory');
const {
  validateEditPractitionerInteractor,
} = require('./validateEditPractitionerInteractor');

describe('validateEditPractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateEditPractitionerInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          EditPrivatePractitionerFactory,
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
          EditPrivatePractitionerFactory,
        }),
      },
      practitioner: { representingPrimary: true },
    });

    expect(errors).toEqual(null);
  });
});
