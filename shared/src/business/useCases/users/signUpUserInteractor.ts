import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';

export const signUpUserInteractor = async (
  applicationContext: IApplicationContext,
  {
    user,
  }: {
    user: {
      password: string;
      name: string;
      email: string;
      confirmPassword: string;
    };
  },
) => {
  const existingUsers = await checkUserAlreadyExists(
    applicationContext,
    user.email,
  );

  if (existingUsers?.length) {
    const accountUnconfirmed = existingUsers.some(
      acct => acct.UserStatus === 'UNCONFIRMED',
    );

    const errorMessage = accountUnconfirmed
      ? 'User exists, email unconfirmed'
      : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  return await cognito.signUp({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Password: newUser.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: newUser.email,
      },
      {
        Name: 'name',
        Value: newUser.name,
      },
    ],
    Username: newUser.email,
  });
};

const checkUserAlreadyExists = async (
  applicationContext: IApplicationContext,
  email: string,
) => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const inCognito = await cognito.listUsers({
    AttributesToGet: ['email'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  return inCognito.Users;
};
