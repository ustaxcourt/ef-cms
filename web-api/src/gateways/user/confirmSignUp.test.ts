import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { confirmSignUp } from '@web-api/gateways/user/confirmSignUp';

describe('confirmSignUp', () => {
  it('should make a call to confirm ownership of the provided email, lowercased', async () => {
    const mockEmail = 'tESt@example.com';
    const mockEmailLowercased = 'test@example.com';
    const mockUserPoolId = 'test';
    applicationContext.environment.userPoolId = mockUserPoolId;

    await confirmSignUp(applicationContext, {
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminConfirmSignUp,
    ).toHaveBeenCalledWith({
      UserPoolId: mockUserPoolId,
      Username: mockEmailLowercased,
    });
  });
});
