import {
  CognitoIdentityProvider,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type SignUpUserResponse = {
  email: string;
  userId: string;
  confirmationCode?: string;
};

export const signUpUserInteractor = async (
  applicationContext: ServerApplicationContext,
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
): Promise<SignUpUserResponse> => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const foundUser = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email: user.email });

  if (foundUser) {
    const errorMessage =
      foundUser.accountStatus === UserStatusType.UNCONFIRMED
        ? 'User exists, email unconfirmed'
        : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();
  const userId = applicationContext.getUniqueId();
  await cognito.signUp({
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
      {
        Name: 'custom:userId',
        Value: userId,
      },
      {
        Name: 'custom:role',
        Value: ROLES.petitioner,
      },
    ],
    Username: newUser.email,
  });

  const { confirmationCode } = await applicationContext
    .getUseCaseHelpers()
    .createUserConfirmation(applicationContext, {
      email: newUser.email,
      userId,
    });

  const signUpUserResponse: SignUpUserResponse = {
    email: user.email,
    userId,
  };

  // Only return confirmationCode locally as we cannot send an email. Do not expose confirmation code in deployed env.
  if (applicationContext.environment.stage === 'local') {
    signUpUserResponse.confirmationCode = confirmationCode;
  }

  return signUpUserResponse;
};
