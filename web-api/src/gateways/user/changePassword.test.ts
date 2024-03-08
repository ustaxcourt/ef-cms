import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { changePassword } from '@web-api/gateways/user/changePassword';

describe('changePassword', () => {
  it('should make a call to disable the provided userId', async () => {
    const mockEmail = 'test@example.com';
    const mockNewPassword = 'P@ssw0rd';
    const mockCode = 'afde08bd-7ccc-4163-9242-87f78cbb2452';
    const mockCognitoClientId = 'test';
    applicationContext.environment.cognitoClientId = mockCognitoClientId;

    await changePassword(applicationContext, {
      code: mockCode,
      email: mockEmail,
      newPassword: mockNewPassword,
    });

    expect(
      applicationContext.getCognito().confirmForgotPassword,
    ).toHaveBeenCalledWith({
      ClientId: mockCognitoClientId,
      ConfirmationCode: mockCode,
      Password: mockNewPassword,
      Username: mockEmail,
    });
  });
});
