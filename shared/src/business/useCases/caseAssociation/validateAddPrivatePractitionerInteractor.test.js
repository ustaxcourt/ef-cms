const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddPrivatePractitionerInteractor,
} = require('./validateAddPrivatePractitionerInteractor');

describe('validateAddPrivatePractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateAddPrivatePractitionerInteractor({
      applicationContext,
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual(['user', 'representingPrimary']);
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddPrivatePractitionerInteractor({
      applicationContext,
      counsel: { representingPrimary: true, user: {} },
    });

    expect(errors).toEqual(null);
  });
});
