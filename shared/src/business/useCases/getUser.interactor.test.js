const { UnknownUserError } = require('../../errors/errors');
const { getUser } = require('./getUser.interactor');

describe('Get user', () => {
  it('Success taxpayer', async () => {
    const user = await getUser('taxpayer');
    expect(user.userId).toEqual('taxpayer');
    expect(user.role).toEqual('petitioner');
  });

  it('not found', async () => {
    let result = 'error';
    try {
      await getUser({ userId: 'someuser'} );
    } catch (e) {
      if (e instanceof UnknownUserError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });
});
