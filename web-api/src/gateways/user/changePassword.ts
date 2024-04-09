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

  // Check if user in force change password
  const user = await applicationContext.getCognito().adminGetUser({
    UserPoolId: applicationContext.environment.userPoolId,
    Username: lowerCaseEmail,
  });

  // if in force change password do initiateAuth() into respondToAuthChallenge()
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

    if (
      initiateAuthResult.ChallengeName !==
      ChallengeNameType.NEW_PASSWORD_REQUIRED
    ) {
      throw new Error('User is not in `FORCE_CHANGE_PASSWORD` state');
    }

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
    // if not in force change password do confirmForgotPassword()
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
