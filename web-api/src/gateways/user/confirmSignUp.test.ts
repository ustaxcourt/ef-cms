import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { confirmSignUp } from '@web-api/gateways/user/confirmSignUp';

describe('confirmSignUp', () => {
  it('should make a call confirm ownership of the provided email', async () => {
    const mockEmail = 'test@example.com';
    const mockUserPoolId = 'test';
    applicationContext.environment.userPoolId = mockUserPoolId;

    await confirmSignUp(applicationContext, {
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminConfirmSignUp,
    ).toHaveBeenCalledWith({
      UserPoolId: mockUserPoolId,
      Username: mockEmail,
    });
  });
});
