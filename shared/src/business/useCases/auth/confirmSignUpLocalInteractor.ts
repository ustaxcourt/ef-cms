/**
 * confirmSignUpLocalInteractor
 * @param {object} applicationContext the application context
 * @param {object} auth an object
 * @param {string} auth.confirmationCode the email confirmation code provided by cognito
 * @param {string} auth.userEmail the email of the user confirming their account
 * @returns {Promise} the promise of both the refresh token and the auth token
 */
export const confirmSignUpLocalInteractor = async (
  applicationContext: IApplicationContext,
  {
    confirmationCode,
    userEmail,
  }: { confirmationCode: string; userEmail: string },
) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    ConfirmationCode: confirmationCode,
    Username: userEmail,
  };

  return await applicationContext.getCognito().confirmSignUp(params).promise();
};
