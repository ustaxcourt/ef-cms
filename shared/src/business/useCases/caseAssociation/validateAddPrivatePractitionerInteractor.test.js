const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddPrivatePractitionerInteractor,
} = require('./validateAddPrivatePractitionerInteractor');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');

describe('validateAddPrivatePractitionerInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateAddPrivatePractitionerInteractor({
      applicationContext,
      counsel: {},
    });

    expect(Object.keys(errors)).toEqual([
      'serviceIndicator',
      'user',
      'representingPrimary',
    ]);
  });

  it('returns null when no errors occur', () => {
    const errors = validateAddPrivatePractitionerInteractor({
      applicationContext,
      counsel: {
        representingPrimary: true,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: {},
      },
    });

    expect(errors).toEqual(null);
  });
});
