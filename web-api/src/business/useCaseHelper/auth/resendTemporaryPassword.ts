import {
  AdminCreateUserCommandInput,
  DeliveryMediumType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function resendTemporaryPassword(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<void> {
  const createUserArgs: AdminCreateUserCommandInput = {
    DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
    MessageAction: 'RESEND',
    UserPoolId: applicationContext.environment.userPoolId,
    Username: email.toLowerCase(),
  };

  if (applicationContext.environment.stage !== 'prod') {
    createUserArgs.TemporaryPassword =
      applicationContext.environment.defaultAccountPass;
  }

  await applicationContext.getCognito().adminCreateUser(createUserArgs);
}
