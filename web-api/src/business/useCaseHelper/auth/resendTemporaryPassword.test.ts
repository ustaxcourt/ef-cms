import { DeliveryMediumType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { resendTemporaryPassword } from '@web-api/business/useCaseHelper/auth/resendTemporaryPassword';

describe('resendTemporaryPassword', () => {
  it('should make a call to persistence to resend an invitation email to the provided email address', async () => {
    const mockEmail = 'PetitioneR@example.com';

    await resendTemporaryPassword(applicationContext, {
      email: mockEmail,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
      MessageAction: 'RESEND',
      UserPoolId: applicationContext.environment.userPoolId,
      Username: 'petitioner@example.com',
    });
  });

  it('should NOT set a TemporaryPassword when running in the prod stage', async () => {
    const originalStage = applicationContext.environment.stage;
    applicationContext.environment.stage = 'prod';

    const mockEmail = 'PetitioneR@example.com';

    await resendTemporaryPassword(applicationContext, {
      email: mockEmail,
    });

    const callArgs =
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0];
    expect(callArgs.TemporaryPassword).toBeUndefined();

    applicationContext.environment.stage = originalStage;
  });
});
