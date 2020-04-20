const {
  EditPrivatePractitionerFactory,
} = require('../../entities/caseAssociation/EditPrivatePractitionerFactory');
const {
  validateEditPrivatePractitionerInteractor,
} = require('./validateEditPrivatePractitionerInteractor');

describe('validateEditPrivatePractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateEditPrivatePractitionerInteractor({
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
    const errors = validateEditPrivatePractitionerInteractor({
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
