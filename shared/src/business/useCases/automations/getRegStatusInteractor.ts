import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import {
  GetSuppressedDestinationCommand,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getUsersWithSimilarEmails } from '@shared/business/useCases/automations/automationsHelpers';

// This interactor is for Zendesk use only, and should never by called by DAWSON
export const getRegStatusInteractor = async (
  { userEmail }: { userEmail: string },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_REG_STATUS)) {
    throw new UnauthorizedError(`Unauthorized`);
  }

  const matchedUsers = await getUsersWithSimilarEmails({
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
    `Searching for ${escapeHtml(userEmail)} in DAWSON<br><br>` +
    `Found ${fullUsers.length} user(s) matching ${escapeHtml(userEmail)}`;

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

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
