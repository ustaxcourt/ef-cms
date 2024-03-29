import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { forgotPassword } from '@web-api/gateways/user/forgotPassword';

describe('forgotPassword', () => {
  it('should make a call to indicate the user with the provided email forgot their password', async () => {
    const mockEmail = 'test@example.com';
    const mockCognitoClientId = 'test';
    applicationContext.environment.cognitoClientId = mockCognitoClientId;

    await forgotPassword(applicationContext, {
      email: mockEmail,
    });

    expect(applicationContext.getCognito().forgotPassword).toHaveBeenCalledWith(
      {
        ClientId: mockCognitoClientId,
        Username: mockEmail,
      },
    );
  });
});