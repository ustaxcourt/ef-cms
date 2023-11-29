export const cognitoResendVerificationLinkInteractor = async (
  applicationContext: IApplicationContext,
  { email }: { email: string },
) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
  };
  return await applicationContext
    .getCognito()
    .resendConfirmationCode(params)
    .promise();
};
