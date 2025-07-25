import { UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ListUsersCommand,
  UserStatusType,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  GetSuppressedDestinationCommand,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import { getCognito } from '@web-api/persistence/cognito/getCognito';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getRegStatusInteractor = async (
  applicationContext: ServerApplicationContext,
  { userEmail }: { userEmail: string },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_REG_STATUS)) {
    throw new UnauthorizedError(`Unauthorized`);
  }

  const matchedUsers = await getUsersWithSimilarEmails({
    applicationContext,
    userEmail,
  });

  if (!matchedUsers.length) {
    return `Could not find user with Email ${userEmail} in Cognito`;
  }

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
        const practitionerUser = await getUserById({ userId: user.userId });
        barNumber = practitionerUser?.barNumber;
      }

      const isSuppressed = await isEmailSuppressed(user.email);

      return {
        ...user,
        docketNumbers,
        isSuppressed,
        ...(barNumber && { barNumber }),
      };
    }),
  );

  let returnHtml =
    `Searching for ${userEmail} in DAWSON<br><br>` +
    `Found ${fullUsers.length} user(s) matching ${userEmail}`;

  for (const user of fullUsers) {
    returnHtml +=
      `<br><br>` +
      `Email: ${user.email} <br>` +
      `Role: ${user.role} <br>` +
      `${parseStatus(user.status)} <br>` +
      `Cases: ${user.docketNumbers.join(', ')} <br>`;
    if (user.barNumber) {
      returnHtml += `Bar Number: ${user.barNumber} <br>`;
    }
    if (user.isSuppressed) {
      returnHtml += '❗ Email is on Suppression List <br>';
    }
    if (!user.enabled) {
      returnHtml += '❗ User is disabled <br>';
    }
  }

  return returnHtml;
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

function parseStatus(status: UserStatusType | string): string {
  switch (status) {
    case UserStatusType.CONFIRMED:
      return 'Current status is CONFIRMED; They need to change their own password';
    case UserStatusType.FORCE_CHANGE_PASSWORD:
      return 'Current status is FORCE_CHANGE_PASSWORD; they need to set a permanent password';
    case UserStatusType.UNCONFIRMED:
      return 'Current status is UNCONFIRMED; they have not yet verified their email address';
    default:
      return `Found status: ${status}`;
  }
}

async function getUsersWithSimilarEmails({
  applicationContext,
  userEmail,
}: {
  applicationContext: ServerApplicationContext;
  userEmail: string;
}): Promise<UserInfo[]> {
  const normalizedEmail = userEmail.toLowerCase();
  const [username, domain] = normalizedEmail.split('@');

  const listCommand = new ListUsersCommand({
    UserPoolId: applicationContext.environment.userPoolId,
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

let sesv2Client: SESv2Client;
async function isEmailSuppressed(email: string): Promise<boolean> {
  if (!sesv2Client) {
    sesv2Client = new SESv2Client({
      maxAttempts: 3,
      region: 'us-east-1',
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        requestTimeout: 5000,
      }),
    });
  }

  try {
    const command = new GetSuppressedDestinationCommand({
      EmailAddress: email,
    });

    const response = await sesv2Client.send(command);

    return !!response.SuppressedDestination;
  } catch (err: any) {
    if (err?.name === 'NotFoundException') {
      // Email not on suppression list
      return false;
    }

    console.error('Failed to check suppression list:', err);
    throw err;
  }
}

type UserInfo = {
  email: string;
  role: string;
  status: string;
  userId: string;
  enabled: boolean;
};
