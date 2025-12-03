import { ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognito } from '@web-api/persistence/cognito/getCognito';
import { environment } from '@web-api/environment';
import { getUsersWithSimilarEmails } from '@shared/business/useCases/automations/automationsHelpers';
import { ROLES } from '@shared/business/entities/EntityConstants';

jest.mock('@web-api/environment', () => ({
  environment: { userPoolId: 'pool-123' },
}));

const mockSend = jest.fn();
jest.mock('@web-api/persistence/cognito/getCognito', () => ({
  getCognito: jest.fn(() => ({ send: mockSend })),
}));

describe('getUsersWithSimilarEmails', () => {
  const mockUserName = 'user.name';
  const mockEmail = `${mockUserName}@ustaxcourt.gov`;
  const mockUserId = 'abc-123';

  const mockUser = {
    Username: 'real user',
    Enabled: true,
    UserStatus: 'CONFIRMED',
    Attributes: [
      { Name: 'email', Value: mockEmail },
      { Name: 'custom:role', Value: ROLES.docketClerk },
      { Name: 'custom:userId', Value: mockUserId },
    ],
  };

  mockSend.mockResolvedValue({
    Users: [mockUser],
  });

  it('should construct ListUsersCommand with correct pool, attributes, filter, and limit', async () => {
    const inputEmail = 'User.Name@USTaxCourt.gov';

    const result = await getUsersWithSimilarEmails({ userEmail: inputEmail });

    expect(getCognito().send).toHaveBeenCalledTimes(1);
    const cognitoSend = (getCognito().send as jest.Mock).mock.calls[0][0];
    expect(cognitoSend).toBeInstanceOf(ListUsersCommand);

    expect(cognitoSend.input).toMatchObject({
      UserPoolId: environment.userPoolId,
      AttributesToGet: ['email', 'custom:role', 'custom:userId'],
      Filter: `email ^= "${mockUserName}"`,
    });

    expect(result).toEqual([
      {
        email: mockEmail,
        role: ROLES.docketClerk,
        status: 'CONFIRMED',
        userId: mockUserId,
        enabled: true,
      },
    ]);
  });

  it('should filter to only users whose email domain matches the input domain', async () => {
    mockSend.mockResolvedValueOnce({
      Users: [
        mockUser,
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'user.name@gmail.com' }],
        },
      ],
    });

    const result = await getUsersWithSimilarEmails({
      userEmail: 'user.name@USTAXCOURT.GOV',
    });

    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ email: mockEmail })]),
    );
    expect(result).toHaveLength(1);
  });

  it('should normalize returned email to lowercase uses defaults when attributes are missing', async () => {
    mockSend.mockResolvedValueOnce({
      Users: [
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'MiXeD.CaSe@USTAXCOURT.GOV' }],
          Username: 'username-from-cognito',
          UserStatus: 'FORCE_CHANGE_PASSWORD',
          Enabled: undefined,
        },
      ],
    });

    const result = await getUsersWithSimilarEmails({
      userEmail: 'mixed.case@ustaxcourt.gov',
    });

    expect(result).toEqual([
      {
        email: 'mixed.case@ustaxcourt.gov',
        role: 'petitioner',
        status: 'FORCE_CHANGE_PASSWORD',
        userId: 'username-from-cognito',
        enabled: true,
      },
    ]);
  });

  it('should pass through role, userId (custom attr), status, and enabled when present', async () => {
    const mockEmail = 'staff@ustaxcourt.gov';
    const mockUserId = 'custom-123';
    mockSend.mockResolvedValueOnce({
      Users: [
        {
          ...mockUser,
          Attributes: [
            { Name: 'email', Value: mockEmail },
            { Name: 'custom:role', Value: ROLES.adc },
            { Name: 'custom:userId', Value: mockUserId },
          ],
          UserStatus: 'CONFIRMED',
          Enabled: false,
        },
      ],
    });

    const result = await getUsersWithSimilarEmails({
      userEmail: mockEmail,
    });

    expect(result).toEqual([
      {
        email: mockEmail,
        role: ROLES.adc,
        status: 'CONFIRMED',
        userId: mockUserId,
        enabled: false,
      },
    ]);
  });

  it('should return an empty array when SDK returns no Users', async () => {
    mockSend.mockResolvedValueOnce([]);
    mockSend.mockResolvedValueOnce([]);

    const result = await getUsersWithSimilarEmails({
      userEmail: 'nobody@ustaxcourt.gov',
    });
    expect(result).toEqual([]);
  });

  it('should use only the first part of email (username) for the filter, ignoring domain', async () => {
    mockSend.mockResolvedValueOnce({
      Users: [
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'john+temp@ustaxcourt.gov' }],
        },
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'john@ustaxcourt.gov' }],
        },
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'johnny@ustaxcourt.gov' }],
        },
      ],
    });

    await getUsersWithSimilarEmails({ userEmail: 'john@ustaxcourt.gov' });

    const cognitoSend = (getCognito().send as jest.Mock).mock.calls[0][0];

    expect(cognitoSend.input.Filter).toBe('email ^= "john"');
  });

  it('should ignore users from the same pool whose emails do not match the input domain', async () => {
    mockSend.mockResolvedValueOnce({
      Users: [
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'john@ustaxcourt.gov' }],
        },
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'john@notcourt.gov' }],
        },
        {
          ...mockUser,
          Attributes: [{ Name: 'email', Value: 'john@USTAXCOURT.GOV' }],
        },
      ],
    });

    const res = await getUsersWithSimilarEmails({
      userEmail: 'john@ustaxcourt.gov',
    });

    expect(res.map(u => u.email)).toEqual([
      'john@ustaxcourt.gov',
      'john@ustaxcourt.gov',
    ]);
    expect(res).toHaveLength(2);
  });

  it('should paginate results if query returns a pagination token', async () => {
    const users = [
      {
        email: 'user.name@ustaxcourt.gov',
        role: ROLES.docketClerk,
        status: 'CONFIRMED',
        userId: 'abc-123',
        enabled: true,
      },
      {
        email: 'user.name+2@ustaxcourt.gov',
        role: ROLES.docketClerk,
        status: 'CONFIRMED',
        userId: 'def-456',
        enabled: true,
      },
    ];
    mockSend.mockReturnValueOnce({
      Users: [
        {
          Username: 'real user',
          Enabled: true,
          UserStatus: 'CONFIRMED',
          Attributes: [
            { Name: 'email', Value: users[0].email },
            { Name: 'custom:role', Value: ROLES.docketClerk },
            { Name: 'custom:userId', Value: users[0].userId },
          ],
        },
      ],
      PaginationToken: '12345',
    });
    mockSend.mockReturnValueOnce({
      Users: [
        {
          Username: 'real user 2',
          Enabled: true,
          UserStatus: 'CONFIRMED',
          Attributes: [
            { Name: 'email', Value: users[1].email },
            { Name: 'custom:role', Value: ROLES.docketClerk },
            { Name: 'custom:userId', Value: users[1].userId },
          ],
        },
      ],
      PaginationToken: null,
    });

    const result = await getUsersWithSimilarEmails({
      userEmail: users[0].email,
    });

    expect(getCognito().send).toHaveBeenCalledTimes(2);
    expect(result).toEqual(users);
  });

  it('should search by exact email if initial query does not return an exact match', async () => {
    const users = [
      {
        email: 'user.name@ustaxcourt.gov',
        role: ROLES.docketClerk,
        status: 'CONFIRMED',
        userId: 'abc-123',
        enabled: true,
      },
      {
        email: 'user.name+2@ustaxcourt.gov',
        role: ROLES.docketClerk,
        status: 'CONFIRMED',
        userId: 'def-456',
        enabled: true,
      },
    ];
    mockSend.mockReturnValueOnce({
      Users: [
        {
          Username: 'real user',
          Enabled: true,
          UserStatus: 'CONFIRMED',
          Attributes: [
            { Name: 'email', Value: users[0].email },
            { Name: 'custom:role', Value: ROLES.docketClerk },
            { Name: 'custom:userId', Value: users[0].userId },
          ],
        },
      ],
    });
    mockSend.mockReturnValueOnce({
      Users: [
        {
          Username: 'real user 2',
          Enabled: true,
          UserStatus: 'CONFIRMED',
          Attributes: [
            { Name: 'email', Value: users[1].email },
            { Name: 'custom:role', Value: ROLES.docketClerk },
            { Name: 'custom:userId', Value: users[1].userId },
          ],
        },
      ],
    });

    const result = await getUsersWithSimilarEmails({
      userEmail: users[1].email,
    });

    expect(getCognito().send).toHaveBeenCalledTimes(2);

    const cognitoSend = (getCognito().send as jest.Mock).mock.lastCall[0];
    expect(cognitoSend.input).toMatchObject({
      UserPoolId: environment.userPoolId,
      AttributesToGet: ['email', 'custom:role', 'custom:userId'],
      Filter: `email = "${users[1].email}"`,
    });

    expect(result).toEqual(users);
  });
});
