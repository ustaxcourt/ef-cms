const { User } = require('../../entities/User');
const { validateUserInteractor } = require('./validateUserInteractor');

describe('validateUserInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateUserInteractor({
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
    const errors = validateUserInteractor({
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
