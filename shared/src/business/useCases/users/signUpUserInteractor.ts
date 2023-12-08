import {
  AdminCreateUserCommandInput,
  AdminSetUserPasswordCommandInput,
  ListUsersCommandInput,
  ResendConfirmationCodeCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
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

  const result = await signupUser(applicationContext, newUser);
  // if error, return now instead of attempting the rest...
  await setPassword(applicationContext, newUser);
  await sendConfirmationEmail(applicationContext, newUser);
  return result;
};

const signupUser = async (
  applicationContext: IApplicationContext,
  newUser: NewPetitionerUser,
) => {
  const params: AdminCreateUserCommandInput = {
    MessageAction: 'SUPPRESS',
    UserAttributes: [
      {
        Name: 'email',
        Value: newUser.email,
      },
      {
        Name: 'name',
        Value: newUser.name,
      },
      {
        Name: 'email_verified',
        Value: 'false',
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: newUser.email,
  };

  return await applicationContext
    .getCognito()
    .adminCreateUser(params)
    .promise();
};

const setPassword = async (
  applicationContext: IApplicationContext,
  newUser: NewPetitionerUser,
) => {
  const params: AdminSetUserPasswordCommandInput = {
    Password: newUser.password,
    Permanent: true,
    UserPoolId: process.env.USER_POOLID,
    Username: newUser.email,
  };
  await applicationContext.getCognito().adminSetUserPassword(params).promise();
};

const sendConfirmationEmail = async (
  applicationContext: IApplicationContext,
  newUser: NewPetitionerUser,
) => {
  const params: ResendConfirmationCodeCommandInput = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: newUser.email,
  };
  await applicationContext
    .getCognito()
    .resendConfirmationCode(params)
    .promise();
};

const checkUserAlreadyExists = async (
  applicationContext: IApplicationContext,
  email: string,
): Promise<UsersListType> => {
  const filters: ListUsersCommandInput = {
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
