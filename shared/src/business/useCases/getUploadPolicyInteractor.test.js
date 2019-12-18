const { getUploadPolicyInteractor } = require('./getUploadPolicyInteractor');
const { User } = require('../entities/User');

describe('getUploadPolicyInteractor', () => {
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
      await getUploadPolicyInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('returns the expected policy when the file does not already exist', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          isExternalUser: () => true,
          role: User.ROLES.petitioner,
          userId: 'petitioner',
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

  it('throws an unauthorized exception when file already exists', async () => {
    const applicationContext = {
      getCurrentUser: () => {
        return {
          isExternalUser: () => true,
          role: User.ROLES.petitioner,
          userId: 'petitioner',
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
