import {
  AuthFlowType,
  ChallengeNameType,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function changePassword(
  applicationContext: ServerApplicationContext,
  {
    code,
    email,
    newPassword,
  }: { code: string; newPassword: string; email: string },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> {
  const lowerCaseEmail = email.toLowerCase();

  const user = await applicationContext.getCognito().adminGetUser({
    UserPoolId: applicationContext.environment.userPoolId,
    Username: lowerCaseEmail,
  });

  if (user.UserStatus === UserStatusType.FORCE_CHANGE_PASSWORD) {
    const initiateAuthResult = await applicationContext
      .getCognito()
      .initiateAuth({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          PASSWORD: code,
          USERNAME: lowerCaseEmail,
        },
        ClientId: applicationContext.environment.cognitoClientId,
      });

    await applicationContext.getCognito().respondToAuthChallenge({
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ChallengeResponses: {
        NEW_PASSWORD: newPassword,
        USERNAME: lowerCaseEmail,
      },
      ClientId: applicationContext.environment.cognitoClientId,
      Session: initiateAuthResult.Session,
    });
  } else {
    await applicationContext.getCognito().confirmForgotPassword({
      ClientId: applicationContext.environment.cognitoClientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: lowerCaseEmail,
    });
  }

  return await applicationContext
    .getUserGateway()
    .initiateAuth(applicationContext, {
      email: lowerCaseEmail,
      password: newPassword,
    });
}
