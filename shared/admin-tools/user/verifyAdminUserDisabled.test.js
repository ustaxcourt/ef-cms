const { verifyAdminUserDisabled } = require('./admin');
jest.mock('aws-sdk');
const aws = require('aws-sdk');

describe('verifyAdminUserDisabled', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const OLD_ENV = process.env;

  beforeAll(() => {
    jest.resetModules();
    process.env.ENV = 'superfake';

    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');

    aws.CognitoIdentityServiceProvider.prototype = {
      adminDisableUser: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      }),
      adminGetUser: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Enabled: false,
        }),
      }),
      listUserPools: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          UserPools: [{ Id: 'asdfb', Name: `efcms-${process.env.ENV}` }],
        }),
      }),
    };
  });

  afterAll(() => {
    if (process.env.ENV === 'superfake') {
      process.env = OLD_ENV; // Restore old environment
    }
  });

  it('should call adminGetUser and return if the user is not enabled', async () => {
    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.log).toHaveBeenCalledWith(
      'USTC Admin user is disabled in verifyAdminUserDisabled.',
    );
  });

  it('should exit and log an error if maxRetries is reached for calling adminDisableUser and user is not enabled', async () => {
    aws.CognitoIdentityServiceProvider.prototype.adminGetUser = jest
      .fn()
      .mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Enabled: true,
        }),
      });

    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.error).toHaveBeenCalledWith(
      'USTC Admin user is NOT disabled as expected. Disabling...',
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should attempt adminDisableUser up to maxRetries of 3 if the user is enabled every time user status is checked', async () => {
    aws.CognitoIdentityServiceProvider.prototype.adminGetUser = jest
      .fn()
      .mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({
          Enabled: true,
        }),
      })
      .mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({
          Enabled: true,
        }),
      })
      .mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({
          Enabled: true,
        }),
      })
      .mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({
          Enabled: false,
        }),
      });

    await verifyAdminUserDisabled({ attempt: 0 });

    const maxRetries = 3;
    expect(console.error).toHaveBeenCalledTimes(maxRetries);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should exit and log an error if an error is thrown that is not "UserNotFoundException"', async () => {
    const mockErrorMsg = 'error error read all about it';
    aws.CognitoIdentityServiceProvider.prototype.adminGetUser = jest
      .fn()
      .mockImplementation(() => {
        throw new Error(mockErrorMsg);
      });

    await verifyAdminUserDisabled({ attempt: 0 });

    expect(console.error).toHaveBeenCalledWith(mockErrorMsg);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
