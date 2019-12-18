const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');
const { User } = require('../entities/User');

describe('getDownloadPolicyUrlInteractor', () => {
  beforeEach(() => {});

  it('throw unauthorized error on invalid role', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: 'admin',
          userId: 'petitioner',
        };
      },
    };
    let error;
    try {
      await getDownloadPolicyUrlInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('returns the expected policy url', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        getDownloadPolicyUrl: () => 'localhost',
      }),
    };
    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
    });
    expect(url).toEqual('localhost');
  });
});
