import { mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getCognito as getCognitoMock } from '@web-api/persistence/cognito/getCognito';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { getRegStatusInteractor } from '@web-api/business/useCases/automations/getRegStatusInteractor';
jest.mock('@aws-sdk/client-sesv2', () => {
  const original = jest.requireActual('@aws-sdk/client-sesv2');

  const mockSend = jest.fn().mockResolvedValue({
    SuppressedDestination: { Reason: 'BOUNCE' },
  });
  const SESv2ClientMock = jest.fn().mockImplementation(() => ({
    send: mockSend,
  }));

  return {
    ...original,
    SESv2Client: SESv2ClientMock,
    GetSuppressedDestinationCommand: original.GetSuppressedDestinationCommand,
    send: mockSend,
  };
});
import * as sesv2 from '@aws-sdk/client-sesv2';
import type { SESv2Client } from '@aws-sdk/client-sesv2';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
jest.mock('@web-api/persistence/cognito/getCognito');
jest.mock('@web-api/persistence/postgres/users/getDocketNumbersByUser');
jest.mock('@web-api/persistence/postgres/users/getUserById');

const mockSend = (sesv2 as unknown as SESv2Client).send as jest.Mock;

describe('getRegStatusInteractor', () => {
  const userEmail = 'user@example.com';
  const mockZendeskUser = {
    email: 'zendeskuser@example.com',
    name: 'Zendesk User',
    role: ROLES.zendesk,
    userId: '43523349-87fe-4d29-91fe-8dd6916d2fda',
  };

  const baseCognitoUser = {
    Attributes: [
      { Name: 'email', Value: userEmail },
      { Name: 'custom:userId', Value: 'abc-123' },
      { Name: 'custom:role', Value: ROLES.privatePractitioner },
    ],
    Enabled: true,
    UserStatus: UserStatusType.CONFIRMED,
    Username: 'abc-123',
  };

  const getCognito = getCognitoMock as jest.Mock;
  const getDocketNumbersByUser = jest.mocked(getDocketNumbersByUserMock);

  beforeEach(() => {
    jest.clearAllMocks();

    getCognito.mockReturnValue({
      send: jest.fn().mockResolvedValue({ Users: [baseCognitoUser] }),
    });

    getDocketNumbersByUser.mockResolvedValue(['101-23', '202-24']);

    jest.mocked(getUserByIdMock).mockResolvedValue(MOCK_PRACTITIONER as DbUser);
  });

  it('throws UnauthorizedError for unauthorized user', async () => {
    await expect(
      getRegStatusInteractor({ userEmail }, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns fully formatted HTML for a valid zendesk user and matching user', async () => {
    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    const expectedHtml =
      `Searching for ${userEmail} in DAWSON<br><br>` +
      `Found 1 user(s) matching ${userEmail}` +
      `<br><br>` +
      `Email: ${userEmail} <br>` +
      `Role: privatePractitioner <br>` +
      `Current status is CONFIRMED; They need to change their own password <br>` +
      `Cases: 101-23, 202-24 <br>` +
      `Bar Number: AB1111 <br>` +
      `❗ Email is on Suppression List <br>`;

    expect(result).toEqual(expectedHtml);
  });

  it('returns fully formatted HTML for two users with matching email domain and prefix', async () => {
    const matchingUser2 = {
      Attributes: [
        { Name: 'email', Value: 'user+user@example.com' },
        { Name: 'custom:userId', Value: 'user-2' },
        { Name: 'custom:role', Value: ROLES.petitionsClerk },
      ],
      Enabled: false,
      UserStatus: 'FORCE_CHANGE_PASSWORD',
      Username: 'user-2',
    };

    getCognito.mockReturnValueOnce({
      send: jest
        .fn()
        .mockResolvedValue({ Users: [baseCognitoUser, matchingUser2] }),
    });

    getDocketNumbersByUser
      .mockResolvedValueOnce(['123-45'])
      .mockResolvedValueOnce(['987-65']);

    mockSend
      .mockRejectedValueOnce({
        name: 'NotFoundException',
      })
      .mockRejectedValueOnce({
        name: 'NotFoundException',
      });

    const result = await getRegStatusInteractor(
      { userEmail: 'user@example.com' },
      mockZendeskUser,
    );

    const expectedHtml =
      `Searching for user@example.com in DAWSON<br><br>` +
      `Found 2 user(s) matching user@example.com` +
      `<br><br>` +
      `Email: user@example.com <br>` +
      `Role: privatePractitioner <br>` +
      `Current status is CONFIRMED; They need to change their own password <br>` +
      `Cases: 123-45 <br>` +
      `Bar Number: AB1111 <br>` +
      `<br><br>` +
      `Email: user+user@example.com <br>` +
      `Role: petitionsclerk <br>` +
      `Current status is FORCE_CHANGE_PASSWORD; they need to set a permanent password <br>` +
      `Cases: 987-65 <br>` +
      `❗ User is disabled <br>`;

    expect(result).toEqual(expectedHtml);
  });

  it('returns message if no matching users are found', async () => {
    // if the first list users command in getUsersWithSimilarEmails does not return the passed email,
    // it will search again with a different filter, so the return value needs to be mocked twice.
    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [] }),
    });
    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [] }),
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).toBe(
      `Could not find user with Email ${userEmail} in Cognito`,
    );
  });

  it('omits bar number if user is not a practitioner', async () => {
    const nonPractitionerUser = {
      ...baseCognitoUser,
      Attributes: [
        { Name: 'email', Value: userEmail },
        { Name: 'custom:userId', Value: 'user-456' },
        { Name: 'custom:role', Value: ROLES.petitionsClerk },
      ],
    };

    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [nonPractitionerUser] }),
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).not.toContain('Bar Number:');
  });

  it('adds disabled notice if user.Enabled is false', async () => {
    const disabledUser = {
      ...baseCognitoUser,
      Enabled: false,
    };

    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [disabledUser] }),
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).toContain('❗ User is disabled');
  });

  it('marks status as unconfirmed if user has not yet verified their email address', async () => {
    const disabledUser = {
      ...baseCognitoUser,
      UserStatus: UserStatusType.UNCONFIRMED,
    };

    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [disabledUser] }),
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).toContain(
      'Current status is UNCONFIRMED; they have not yet verified their email address',
    );
  });

  it('returns user status if it is unexpected', async () => {
    const disabledUser = {
      ...baseCognitoUser,
      UserStatus: UserStatusType.ARCHIVED,
    };

    getCognito.mockReturnValueOnce({
      send: jest.fn().mockResolvedValue({ Users: [disabledUser] }),
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).toContain(`Found status: ${UserStatusType.ARCHIVED}`);
  });

  it('does not mark user as suppressed if email is not suppressed', async () => {
    mockSend.mockRejectedValueOnce({
      name: 'NotFoundException',
    });

    const result = await getRegStatusInteractor({ userEmail }, mockZendeskUser);

    expect(result).not.toContain('Suppression');
  });

  it('logs and rethrows error if SES suppression check fails unexpectedly', async () => {
    const unexpectedError = new Error('Unexpected SES failure');
    mockSend.mockRejectedValueOnce(unexpectedError);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(
      getRegStatusInteractor({ userEmail }, mockZendeskUser),
    ).rejects.toThrow('Unexpected SES failure');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to check suppression list:',
      unexpectedError,
    );

    consoleErrorSpy.mockRestore();
  });
});
