const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateAddPrivatePractitionerInteractor,
} = require('./validateAddPrivatePractitionerInteractor');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');

describe('validateAddPrivatePractitionerInteractor', () => {
  it('should return the expected errors when the private practitioner to add is invalid', () => {
    const errors = validateAddPrivatePractitionerInteractor(
      applicationContext,
      {
        counsel: {},
      },
    );

    expect(Object.keys(errors)).toEqual([
      'representing',
      'serviceIndicator',
      'user',
    ]);
  });

  it('should return null when the private practitioner to add is valid', () => {
    const errors = validateAddPrivatePractitionerInteractor(
      applicationContext,
      {
        counsel: {
          representing: ['d3aa6659-72d7-402c-bb47-152863d4f0d0'],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          user: {},
        },
      },
    );

    expect(errors).toEqual(null);
  });
});
