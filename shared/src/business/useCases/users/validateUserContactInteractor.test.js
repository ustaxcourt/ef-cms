const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateUserContactInteractor,
} = require('./validateUserContactInteractor');

describe('validateUserContactInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateUserContactInteractor(applicationContext, {
      user: {},
    });

    expect(errors).toEqual({
      name: 'Enter name',
      userId: '"userId" is required',
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateUserContactInteractor(applicationContext, {
      user: {
        name: 'Saul Goodman',
        userId: '8675309b-18d0-43ec-bafb-654e83405411',
      },
    });

    expect(errors).toEqual(null);
  });
});
