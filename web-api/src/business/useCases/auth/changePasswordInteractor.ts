import { RespondToAuthChallengeCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const changePasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmPassword,
    password,
    session,
    userEmail,
  }: {
    password: string;
    session: string;
    userEmail: string;
    confirmPassword: string;
  },
) => {
  // confirm password = confirmPassword
  console.log('confirmPassword', confirmPassword);
  const params: RespondToAuthChallengeCommandInput = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ChallengeResponses: {
      NEW_PASSWORD: password,
      USERNAME: userEmail,
    },
    ClientId: process.env.COGNITO_CLIENT_ID,
    Session: session,
  };

  const cognito = applicationContext.getCognito();
  const result = await cognito.respondToAuthChallenge(params);

  return result;
};
