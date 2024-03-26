import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { resendTemporaryPassword } from '@web-api/business/useCaseHelper/auth/resendTemporaryPassword';

describe('resendTemporaryPassword', () => {
  it('should make a call to persistence to resend an invitation email to the provided email address', async () => {
    const mockEmail = 'petitioner@example.com';

    await resendTemporaryPassword(applicationContext, {
      email: mockEmail,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {},
        email: mockEmail,
        resendInvitationEmail: true,
      },
    );
  });
});
