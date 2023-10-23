export const createUserCognitoInteractor = async (
  applicationContext: IApplicationContext,
  { user }: { user: { password: string; name: string; email: string } },
) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Password: user.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'name',
        Value: user.name,
      },
    ],
    Username: user.email,
  };

  return await applicationContext.getCognito().signUp(params).promise();
};
