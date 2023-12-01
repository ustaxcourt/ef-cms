import {
  type AdminCreateUserResponse,
  UsersListType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
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
): Promise<AdminCreateUserResponse> => {
  const existingUsers = await checkUserAlreadyExists(
    applicationContext,
    user.email,
  );

  if (existingUsers.length) {
    const accountUnconfirmed = existingUsers.some(
      acct => acct.UserStatus === 'UNCONFIRMED',
    );

    const errorMessage = accountUnconfirmed
      ? 'User exists, email unconfirmed'
      : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();

  const params = {
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
  };

  return await applicationContext.getCognito().signUp(params).promise();
};

const checkUserAlreadyExists = async (
  applicationContext: IApplicationContext,
  email: string,
): Promise<UsersListType> => {
  const filters = {
    AttributesToGet: ['email'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  };

  const inCognito = await applicationContext
    .getCognito()
    .listUsers(filters)
    .promise();

  return inCognito.Users;
};
