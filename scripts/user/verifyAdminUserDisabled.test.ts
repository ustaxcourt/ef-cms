jest.mock('uuid', () => 'eb7b7961-395d-4b4c-afc6-9ebcadaf0150');
jest.mock('@aws-sdk/client-cognito-identity-provider');
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { verifyAdminUserDisabled } from './admin';

describe('verifyAdminUserDisabled', () => {
  // @ts-ignore
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  beforeAll(() => {
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');

    CognitoIdentityProvider.prototype = {
      ...CognitoIdentityProvider.prototype,
      adminDisableUser: jest.fn().mockResolvedValue({}),
      adminGetUser: jest.fn().mockResolvedValue({
        Enabled: false,
      }),
      destroy: jest.fn().mockResolvedValue({}),
      listUserPools: jest.fn().mockResolvedValue({
        UserPools: [{ Id: 'asdfb', Name: `efcms-${process.env.ENV}` }],
      }),
      send: jest.fn().mockResolvedValue({}),
    };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should call adminGetUser and return if the user is not enabled', async () => {
    process.env.ENV = 'superfake';

    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.log).toHaveBeenCalledWith(
      'USTC Admin user is disabled in verifyAdminUserDisabled.',
    );
  });

  it('should exit and log an error if maxRetries is reached for calling adminDisableUser and user is not enabled', async () => {
    process.env.ENV = 'superfake';

    CognitoIdentityProvider.prototype.adminGetUser = jest
      .fn()
      .mockResolvedValue({
        Enabled: true,
      });

    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.error).toHaveBeenCalledWith(
      'USTC Admin user is NOT disabled as expected. Disabling...',
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should exit and log an error if an error is thrown that is not "UserNotFoundException"', async () => {
    process.env.ENV = 'superfake';

    const mockErrorMsg = 'error error read all about it';
    CognitoIdentityProvider.prototype.adminGetUser = jest
      .fn()
      .mockImplementation(() => {
        throw new Error(mockErrorMsg);
      });

    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.error).toHaveBeenCalledWith(mockErrorMsg);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
