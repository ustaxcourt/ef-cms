import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUploadPolicyInteractor } from './getUploadPolicyInteractor';

describe('getUploadPolicyInteractor', () => {
  it('throw unauthorized error on invalid role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'petitioner',
    });
    let error;
    try {
      await getUploadPolicyInteractor(applicationContext, {} as any);
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

    const url = await getUploadPolicyInteractor(applicationContext, {} as any);
    expect(url).toEqual('policy');
  });

  it('does not check if the file exists if the user is internal', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      isExternalUser: () => false,
      role: ROLES.docketClerk,
      userId: 'docket',
    });
    applicationContext
      .getPersistenceGateway()
      .getUploadPolicy.mockReturnValue('policy');

    await getUploadPolicyInteractor(applicationContext, {} as any);
    expect(
      applicationContext.getPersistenceGateway().isFileExists,
    ).not.toHaveBeenCalled();
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
      await getUploadPolicyInteractor(applicationContext, {} as any);
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
