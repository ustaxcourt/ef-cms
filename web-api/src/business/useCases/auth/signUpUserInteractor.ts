import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
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

  const { Users: existingAccounts } = await cognito.listUsers({
    AttributesToGet: ['email'],
    Filter: `email = "${user.email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  if (existingAccounts?.length) {
    const accountUnconfirmed = existingAccounts.some(
      acct => acct.UserStatus === 'UNCONFIRMED',
    );

    const errorMessage = accountUnconfirmed
      ? 'User exists, email unconfirmed'
      : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();

  const result = await cognito.signUp({
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
        Value: applicationContext.getUniqueId(),
      },
    ],
    Username: newUser.email,
  });

  // Todo: use 'new' helper function to signify that this _could_ be custom:userId
  const userId = result.UserSub!;

  //TODO 10007: ensure userId is standardized/consistent
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
