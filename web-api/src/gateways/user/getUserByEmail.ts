import {
  AdminGetUserCommandOutput,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const getUserByEmail = async (
  applicationContext: ServerApplicationContext,
  { email, poolId }: { email: string; poolId?: string },
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
  let foundUser: AdminGetUserCommandOutput;
  try {
    foundUser = await applicationContext.getCognito().adminGetUser({
      UserPoolId: poolId ?? process.env.USER_POOL_ID,
      Username: email.toLowerCase(),
    });
  } catch (err: any) {
    if (err.name === 'UserNotFoundException') {
      return;
    }
    throw err;
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
