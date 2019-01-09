const { getInternalUsers } = require('./getInternalUsers.interactor');
const User = require('../entities/User');

describe('Get internal users', () => {
  const applicationContext = {
    user: { userId: 'docketclerk' },
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
});
