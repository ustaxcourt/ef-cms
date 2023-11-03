import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';

export const createUserCognitoInteractor = async (
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
  const emailExistsInSystem = await checkUserAlreadyExists(
    applicationContext,
    user.email,
  );

  if (emailExistsInSystem) {
    throw new Error('User already exists');
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

  return !!inCognito.Users?.length;
};
