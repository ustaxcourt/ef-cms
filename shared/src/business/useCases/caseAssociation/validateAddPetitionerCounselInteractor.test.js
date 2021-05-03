const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddPetitionerCounselInteractor,
} = require('./validateAddPetitionerCounselInteractor');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');

describe('validateAddPetitionerCounselInteractor', () => {
  it('returns the expected errors object on an empty add practitioner', () => {
    const errors = validateAddPetitionerCounselInteractor({
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
    const errors = validateAddPetitionerCounselInteractor({
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
