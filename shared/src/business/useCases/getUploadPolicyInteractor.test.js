const { applicationContext } = require('../test/createTestApplicationContext');
const { getUploadPolicyInteractor } = require('./getUploadPolicyInteractor');
const { ROLES } = require('../entities/EntityConstants');

describe('getUploadPolicyInteractor', () => {
  it('throw unauthorized error on invalid role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'petitioner',
    });
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
    applicationContext.getCurrentUser.mockReturnValue({
      isExternalUser: () => true,
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockReturnValue(false);

    const url = await getUploadPolicyInteractor({
      applicationContext,
    });
    expect(url).toEqual('policy');
  });

  it('throws an unauthorized exception when file already exists', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      isExternalUser: () => true,
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockReturnValue(true);

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
