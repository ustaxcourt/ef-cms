import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const createUserCognitoInteractor = async (
  applicationContext: IApplicationContext,
  { user }: { user: { password: string; name: string; email: string } },
): Promise<AdminCreateUserResponse> => {
  const emailExistsInSystem = await checkUserAlreadyExists(
    applicationContext,
    user.email,
  );

  if (emailExistsInSystem) {
    throw new Error('User already exists');
  }

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

const checkUserAlreadyExists = async (
  applicationContext: IApplicationContext,
  email: string,
): Promise<boolean> => {
  const filters = {
    AttributesToGet: ['email'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  };

  const inCognito = await applicationContext
    .getCognito()
    .listUsers(filters)
    .promise();

  return inCognito.Users.length;
};
