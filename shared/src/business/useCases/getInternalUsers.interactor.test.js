const { getInternalUsers } = require('./getInternalUsers.interactor');
const User = require('../entities/User');

describe('Get internal users', () => {
  const applicationContext = {
    getCurrentUser: () => {
      return { userId: 'docketclerk' };
    },
  };

  it('returns all users', async () => {
    const users = await getInternalUsers({ applicationContext });
    expect(users.length).toEqual(3);
    let error;
    try {
      User.validateRawCollection(users);
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });

  it('throws unauthorized error for unauthorized users', async () => {
    let error;
    try {
      await getInternalUsers({
        applicationContext: {
          getCurrentUser: () => ({
            userId: 'taxpayer',
          }),
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
