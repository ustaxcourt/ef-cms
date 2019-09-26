const { getUploadPolicyInteractor } = require('./getUploadPolicyInteractor');

describe('getUploadPolicyInteractor', () => {
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
      await getUploadPolicyInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('returns the expected policy', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          isExternalUser: () => true,
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getUploadPolicy: () => 'policy',
        isFileExists: () => false,
      }),
    };
    const url = await getUploadPolicyInteractor({
      applicationContext,
    });
    expect(url).toEqual('policy');
  });

  it('returns the expected policy', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          isExternalUser: () => true,
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getUploadPolicy: () => 'policy',
        isFileExists: () => true,
      }),
    };

    let error;
    try {
      await getUploadPolicyInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
