const { getUserInteractor } = require('./getUserInteractor');

describe('Get user', () => {
  it('returns a valid user', async () => {
    const user = await getUserInteractor({
      role: 'docketclerk',
      section: 'docket',
      userId: 'docketclerk',
    });
    expect(user).toEqual({
      role: 'docketclerk',
      section: 'docket',
      userId: 'docketclerk',
    });
  });
});
