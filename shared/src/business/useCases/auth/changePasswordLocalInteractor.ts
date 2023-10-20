/**
 * changePasswordLocalInteractor
 * @param {object} applicationContext the application context
 * @param {object} auth an object
 * @param {string} auth.newPassword the new password provided by a local user
 * @param {string} auth.sessionId the cognito (local) session id
 * @param {string} auth.userEmail the email of the user changing passwords
 * @returns {Promise} the promise of a Cognito AuthenticationResult
 */
export const changePasswordLocalInteractor = async (
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
