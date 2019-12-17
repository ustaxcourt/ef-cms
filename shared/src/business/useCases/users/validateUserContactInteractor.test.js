const {
  validateUserContactInteractor,
} = require('./validateUserContactInteractor');
const { User } = require('../../entities/User');

describe('validateUserContactInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateUserContactInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          User,
        }),
      },
      user: {},
    });

    expect(errors).toEqual({ userId: '"userId" is required' });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateUserContactInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          User,
        }),
      },
      user: {
        userId: '8675309b-18d0-43ec-bafb-654e83405411',
      },
    });

    expect(errors).toEqual(null);
  });
});
