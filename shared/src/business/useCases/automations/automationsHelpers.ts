import {
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { environment } from '@web-api/environment';
import { getCognito } from '@web-api/persistence/cognito/getCognito';

type UserInfo = {
  email: string;
  role: string;
  status: string;
  userId: string;
  enabled: boolean;
};

export async function getUsersWithSimilarEmails({
  userEmail,
}: {
  userEmail: string;
}): Promise<UserInfo[]> {
  const normalizedEmail = userEmail.toLowerCase();

  const [username, domain] = normalizedEmail.split('@');

  const listCommand = new ListUsersCommand({
    UserPoolId: environment.userPoolId,
    AttributesToGet: ['email', 'custom:role', 'custom:userId'],
    Filter: `email ^= "${username}"`,
    Limit: 60,
  });

  const { Users = [] } = await getCognito().send(listCommand);

  const matchedUsers = Users.reduce<UserInfo[]>((acc, user) => {
    const info = gatherUserInfo(user);
    if (info.email.endsWith(`@${domain}`)) {
      acc.push(info);
    }
    return acc;
  }, []);

  return matchedUsers;
}

function gatherUserInfo(user: UserType): UserInfo {
  const attributes = user.Attributes ?? [];

  const getAttr = (name: string) =>
    attributes.find(attr => attr.Name === name)?.Value;

  return {
    email: getAttr('email')?.toLowerCase()!,
    role: getAttr('custom:role') ?? 'petitioner',
    status: user.UserStatus!,
    userId: getAttr('custom:userId') ?? user.Username!,
    enabled: user.Enabled ?? true,
  };
}
