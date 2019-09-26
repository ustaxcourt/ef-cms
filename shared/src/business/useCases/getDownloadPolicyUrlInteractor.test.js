const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');

describe('getDownloadPolicyUrlInteractor', () => {
  beforeEach(() => {});

  it('throw unauthorized error on invaliid role', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          role: 'admin',
          userId: 'taxpayer',
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
          role: 'petitioner',
          userId: 'taxpayer',
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
