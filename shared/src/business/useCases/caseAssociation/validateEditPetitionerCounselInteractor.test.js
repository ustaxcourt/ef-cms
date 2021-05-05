const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateEditPetitionerCounselInteractor,
} = require('./validateEditPetitionerCounselInteractor');

describe('validateEditPetitionerCounselInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateEditPetitionerCounselInteractor({
      applicationContext,
      practitioner: {},
    });

    expect(Object.keys(errors)).toEqual(['representingPrimary']);
  });

  it('returns null when no errors occur', () => {
    const errors = validateEditPetitionerCounselInteractor({
      applicationContext,
      practitioner: { representingPrimary: true },
    });

    expect(errors).toEqual(null);
  });
});
