import {
  AdminDeleteUserCommand,
  AdminResetUserPasswordCommand,
  CognitoIdentityProvider,
  ListUsersCommand,
  ListUsersCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';

export const getAllCognitoUsers = async ({
  cognito,
  Limit = 60,
  UserPoolId,
}: {
  cognito: CognitoIdentityProvider;
  Limit?: number;
  UserPoolId: string;
}): Promise<UserType[]> => {
  let allUsers: UserType[] = [];
  let paginationToken: string | undefined = undefined;

  do {
    const command = new ListUsersCommand({
      Limit,
      PaginationToken: paginationToken,
      UserPoolId,
    });

    try {
      const response: ListUsersCommandOutput = await cognito.send(command);
      if (response.Users) {
        allUsers = allUsers.concat(response.Users);
      }
      paginationToken = response.PaginationToken;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  } while (paginationToken);

  return allUsers;
};

export const getEnabledCognitoUsers = async ({
  cognito,
  Limit = 60,
  UserPoolId,
}: {
  cognito: CognitoIdentityProvider;
  Limit?: number;
  UserPoolId: string;
}): Promise<UserType[]> => {
  let enabledUsers: UserType[] = [];
  let paginationToken: string | undefined = undefined;

  do {
    const command = new ListUsersCommand({
      Limit,
      PaginationToken: paginationToken,
      UserPoolId,
    });

    try {
      const response: ListUsersCommandOutput = await cognito.send(command);
      if (response.Users) {
        enabledUsers = enabledUsers.concat(
          response.Users.filter(u => u.Enabled),
        );
      }
      paginationToken = response.PaginationToken;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  } while (paginationToken);

  return enabledUsers;
};

export const deleteUserFromCognito = async ({
  cognito,
  user,
  UserPoolId,
}: {
  cognito: CognitoIdentityProvider;
  user: UserType;
  UserPoolId: string;
}): Promise<boolean> => {
  const adminDeleteUserCommandInput = {
    Username: user.Username,
    UserPoolId,
  };

  let deleted = false;
  try {
    const adminDeleteUserCommand = new AdminDeleteUserCommand(
      adminDeleteUserCommandInput,
    );

    await cognito.send(adminDeleteUserCommand);
    console.log('Deleted user: ', user.Username);
    deleted = true;
  } catch (error) {
    console.error('Error deleting user Username: ', user.Username);
  }
  return deleted;
};

export const resetUserPassword = async ({
  cognito,
  Password,
  user,
  UserPoolId,
}: {
  cognito: CognitoIdentityProvider;
  Password: string;
  user: UserType;
  UserPoolId: string;
}): Promise<boolean> => {
  const adminResetUserPasswordCommandInput = {
    Password,
    Permanent: true,
    Username: user.Username,
    UserPoolId,
  };

  let updated = false;
  try {
    const adminResetUserPasswordCommand = new AdminResetUserPasswordCommand(
      adminResetUserPasswordCommandInput,
    );

    await cognito.send(adminResetUserPasswordCommand);
    console.log('Reset password for user: ', user.Username);
    updated = true;
  } catch (error) {
    console.error('Error resetting password for user: ', user.Username);
  }
  return updated;
};
