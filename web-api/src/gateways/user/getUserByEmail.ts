import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';

// Not every user has a custom:userId. If not then their userId is the sub
// If they have a custom:userId then their userId is custom:userid

// Hosted environment
// Only attributes you ask for will be given back
// Will explode when you ask for attributes that the user does not have.

// Cognito Local
// Will return all attributes no matter what you ask for.
// Will not explode when you ask for attributes that the user does not have.

export const getUserByEmail = async (
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<
  | {
      userId: string;
      email: string;
      accountStatus: UserStatusType;
      role: Role;
      name: string;
    }
  | undefined
> => {
  const cognito = applicationContext.getCognito();
  const foundUser = await cognito.adminGetUser({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  if (!foundUser) {
    return;
  }

  const userId =
    foundUser.UserAttributes?.find(element => element.Name === 'custom:userId')
      ?.Value! ||
    foundUser.UserAttributes?.find(element => element.Name === 'sub')?.Value!;
  const role = foundUser.UserAttributes?.find(
    element => element.Name === 'custom:role',
  )?.Value! as Role;

  const name = foundUser.UserAttributes?.find(
    element => element.Name === 'name',
  )?.Value!;

  return {
    accountStatus: foundUser.UserStatus!,
    email,
    name,
    role,
    userId,
  };
};
