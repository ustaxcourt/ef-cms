import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';

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
  // Temporary code to prevent creation of duplicate accounts while Cognito is still case sensitive.
  // We do not want to allow people to make two accounts for the same email that only differ by casing.
  // const { Users: existingAccounts } = await applicationContext
  //   .getCognito()
  //   .listUsers({
  //     AttributesToGet: ['email'],
  //     Filter: `email = "${user.email}"`,
  //     UserPoolId: applicationContext.environment.userPoolId,
  //   });
  const existingAccount = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: user.email,
    });

  if (existingAccount) {
    const accountUnconfirmed =
      existingAccount.accountStatus === UserStatusType.UNCONFIRMED;

    const errorMessage = accountUnconfirmed
      ? 'User exists, email unconfirmed'
      : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();

  const { userId } = await applicationContext
    .getUserGateway()
    .signUp(applicationContext, {
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
      role: ROLES.petitioner,
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
