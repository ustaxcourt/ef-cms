import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { resendTemporaryPassword } from '@web-api/business/useCaseHelper/auth/resendTemporaryPassword';

describe('resendTemporaryPassword', () => {
  it('should make a call to persistence to resend an invitation email to the provided email address', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockUserId = '9b58ab0d-b74d-4f28-9b8d-57e8f29833b9';

    await resendTemporaryPassword(applicationContext, {
      email: mockEmail,
      userId: mockUserId,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          userId: mockUserId,
        },
        email: mockEmail,
        resendInvitationEmail: true,
      },
    );
  });
});
