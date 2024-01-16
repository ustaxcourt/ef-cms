export const changePasswordInteractor = async (
  applicationContext: IApplicationContext,
  {
    newPassword,
    sessionId,
    userEmail,
  }: { newPassword: string; sessionId: string; userEmail: string },
) => {
  const params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ChallengeResponses: {
      NEW_PASSWORD: newPassword,
      USERNAME: userEmail,
    },
    ClientId: process.env.COGNITO_CLIENT_ID,
    Session: sessionId,
  };

  const result = await applicationContext
    .getCognito()
    .respondToAuthChallenge(params)
    .promise();

  return result;
};
