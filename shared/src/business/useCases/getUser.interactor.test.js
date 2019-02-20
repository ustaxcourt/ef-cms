const { getUser } = require('./getUser.interactor');

describe('Get user', () => {
  it('returns the same user passed in with section defined', async () => {
    const user = await getUser({
      userId: 'docketclerk',
      role: 'docketclerk',
    });
    expect(user).toEqual({
      userId: 'docketclerk',
      role: 'docketclerk',
      section: 'docket',
    });
  });
});
