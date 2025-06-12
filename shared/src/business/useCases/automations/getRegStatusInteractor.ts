import { UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { getCognito } from '@web-api/persistence/cognito/getCognito';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getBarNumberByPractitionerId } from '@web-api/persistence/postgres/users/getBarNumberByPractitionerId';

export const getRegStatusInteractor = async (
  applicationContext: ServerApplicationContext,
  { userEmail }: { userEmail: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(`Invalid User`);
  }

  const matchedUsers = await getUsersWithSimilarEmails({
    applicationContext,
    userEmail,
  });

  const fullUsers = await settlePromises(
    matchedUsers.map(async user => {
      const docketNumbers = await getDocketNumbersByUser({
        userId: user.userId,
      });

      let barNumber: string | undefined;

      if (
        user.role === ROLES.privatePractitioner ||
        user.role === ROLES.irsPractitioner
      ) {
        barNumber = await getBarNumberByPractitionerId({ userId: user.userId });
      }

      return {
        ...user,
        docketNumbers,
        ...(barNumber && { barNumber }),
      };
    }),
  );

  return fullUsers;
};

// leaving the functions below in this file to make clear that they are only to be used by Zendesk automations

function gatherUserInfo(user: UserType): UserInfo {
  const attributes = user.Attributes ?? [];

  const getAttr = (name: string) =>
    attributes.find(attr => attr.Name === name)?.Value;

  return {
    email: getAttr('email')!,
    role: getAttr('custom:role') ?? 'petitioner',
    status: user.UserStatus!,
    userId: getAttr('custom:userId') ?? user.Username!,
    enabled: user.Enabled ?? true,
  };
}

async function getUsersWithSimilarEmails({
  applicationContext,
  userEmail,
}: {
  applicationContext: ServerApplicationContext;
  userEmail: string;
}): Promise<UserInfo[]> {
  const client = await getCognito();

  const normalizedEmail = userEmail.toLowerCase();
  const [username, domain] = normalizedEmail.split('@');

  const listCommand = new ListUsersCommand({
    UserPoolId: applicationContext.environment.userPoolId,
    AttributesToGet: ['email', 'custom:role', 'custom:userId'],
    Filter: `email ^= "${username}"`,
    Limit: 60,
  });

  const { Users = [] } = await client.send(listCommand);

  const matchedUsers = Users.reduce<UserInfo[]>((acc, user) => {
    const info = gatherUserInfo(user);
    if (info.email.endsWith(`@${domain}`)) {
      acc.push(info);
    }
    return acc;
  }, []);

  return matchedUsers;
}

type UserInfo = {
  email: string;
  role: string;
  status: string;
  userId: string;
  enabled: boolean;
};
