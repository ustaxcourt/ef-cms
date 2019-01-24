const { getUser } = require('./getUser.interactor');

describe('Get user', () => {
  it('Success taxpayer', async () => {
    const user = await getUser('taxpayer');
    expect(user.userId).toEqual('taxpayer');
    expect(user.role).toEqual('petitioner');
  });
  it('not found', async () => {
    const user = await getUser('someuser');
    expect(user).toBeNull();
  });
});
