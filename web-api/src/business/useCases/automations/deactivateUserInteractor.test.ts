import {
  DOCKET_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { getUsersWithSimilarEmails as getUsersWithSimilarEmailsMock } from '@web-api/business/useCases/automations/automationsHelpers';
import { deactivateUserInteractor } from '@web-api/business/useCases/automations/deactivateUserInteractor';
import { getUserGateway as getUserGatewayMock } from '@web-api/getUserGateway';
import { deactivateUser as deactivateUserMock } from '@web-api/persistence/postgres/users/deactivateUser';
jest.mock('@web-api/business/useCases/automations/automationsHelpers');

jest.mock('@web-api/getUserGateway', () => ({
  getUserGateway: jest.fn(() => ({
    disableUser: jest.fn(),
  })),
}));

jest.mock('@web-api/persistence/postgres/users/deactivateUser', () => ({
  deactivateUser: jest.fn(),
}));

const getUserGateway = getUserGatewayMock as jest.Mock;
const getUsersWithSimilarEmails = jest.mocked(getUsersWithSimilarEmailsMock);
const deactivateUser = jest.mocked(deactivateUserMock);

describe('deactivateUserInteractor', () => {
  const authorizedUser = {
    role: ROLES.zendesk,
    userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
    email: 'zendesk@example.com',
    name: 'Zendesk User',
  };

  const unauthorizedUser = {
    role: ROLES.docketClerk,
    userId: 'unauthorized-user-id',
    email: 'unauthorized@example.com',
    name: 'Unauthorized User',
  };

  const baseCourtEmail = 'courtuser@ustaxcourt.gov';
  const aliasCourtEmail = 'courtuser+temp@ustaxcourt.gov';

  const mockCourtUser = {
    email: baseCourtEmail,
    role: ROLES.petitionsClerk,
    status: 'CONFIRMED',
    userId: 'user-1',
    enabled: true,
  };

  beforeAll(() => {
    getUserGateway.mockReturnValue({
      disableUser: jest.fn().mockResolvedValue(undefined),
    });
    deactivateUser.mockResolvedValue(DOCKET_SECTION);
    getUsersWithSimilarEmails.mockResolvedValue([]);
  });

  it('should throw UnauthorizedError if user is not authorized', async () => {
    await expect(
      deactivateUserInteractor(
        { email: 'testUser@example.com' },
        unauthorizedUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw NotFoundError if user does not exist', async () => {
    getUsersWithSimilarEmails.mockResolvedValueOnce([]);
    const email = 'nobody@example.com';

    await expect(
      deactivateUserInteractor({ email }, authorizedUser),
    ).rejects.toThrow(`Did not find any users with the email address ${email}`);
  });

  it('should throw NotFoundError when similar users exist but none match exact or alias', async () => {
    getUsersWithSimilarEmails.mockResolvedValueOnce([
      { ...mockCourtUser, email: 'someone@otherdomain.com' },
    ]);

    await expect(
      deactivateUserInteractor(
        { email: 'zendesk@example.com' },
        authorizedUser,
      ),
    ).rejects.toThrow(
      'Did not find any Court users with the email address zendesk@example.com',
    );

    expect(getUserGateway().disableUser).not.toHaveBeenCalled();
    expect(deactivateUserMock).not.toHaveBeenCalled();
  });

  it('should throw an error if the passed in user is not a Court user', async () => {
    const email = 'nonCourt@example.com';

    getUsersWithSimilarEmails.mockResolvedValueOnce([
      { ...mockCourtUser, email },
    ]);
    getUserGateway.mockReturnValue({
      getUserByEmail: () => ({
        userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
      }),
      disableUser: jest.fn(),
    });

    await expect(
      deactivateUserInteractor({ email }, authorizedUser),
    ).rejects.toThrow(
      `Did not find any Court users with the email address ${email}`,
    );

    expect(getUserGateway().disableUser).not.toHaveBeenCalled();
    expect(deactivateUser).not.toHaveBeenCalled();
  });

  it('should call disableUser and deactivateUser for exact match', async () => {
    const email = 'courtuser@ustaxcourt.gov';
    getUsersWithSimilarEmails.mockResolvedValueOnce([
      {
        ...mockCourtUser,
        email,
      },
    ]);

    const result = await deactivateUserInteractor({ email }, authorizedUser);

    expect(getUserGateway().disableUser).toHaveBeenCalledWith({ email });
    expect(deactivateUser).toHaveBeenCalled();
    expect(result).toEqual(
      `INFO: removed (${mockCourtUser.userId}|${email}) from ${DOCKET_SECTION}`,
    );
  });

  it('should treat alias accounts as the same user', async () => {
    const aliasUser = {
      ...mockCourtUser,
      email: aliasCourtEmail,
      userId: 'user-2',
    };
    getUsersWithSimilarEmails.mockResolvedValueOnce([mockCourtUser, aliasUser]);

    const result = await deactivateUserInteractor(
      { email: baseCourtEmail },
      authorizedUser,
    );

    expect(getUserGateway().disableUser).toHaveBeenCalledWith({
      email: aliasCourtEmail,
    });
    expect(deactivateUserMock).toHaveBeenCalledWith({
      userId: aliasUser.userId,
    });
    expect(result).toContain(`(${mockCourtUser.userId}|${baseCourtEmail})`);
    expect(result).toContain(`(${aliasUser.userId}|${aliasCourtEmail})`);
  });

  it('should aggregate multiple successes and joins with <br>', async () => {
    const second = {
      email: 'courtuser+2@ustaxcourt.gov',
      role: ROLES.admissionsClerk,
      status: 'CONFIRMED',
      userId: 'user-2',
      enabled: true,
    };

    getUsersWithSimilarEmails.mockResolvedValueOnce([
      { ...mockCourtUser },
      second,
    ]);

    deactivateUser
      .mockResolvedValueOnce('docket')
      .mockResolvedValueOnce('admissions');

    const result = await deactivateUserInteractor(
      { email: baseCourtEmail },
      authorizedUser,
    );

    expect(result).toBe(
      `INFO: removed (${mockCourtUser.userId}|${mockCourtUser.email}) from docket<br>` +
        `INFO: removed (${second.userId}|${second.email}) from admissions`,
    );
  });

  it('should throw an error when Cognito disableUser rejects', async () => {
    getUsersWithSimilarEmails.mockResolvedValueOnce([{ ...mockCourtUser }]);
    (getUserGateway().disableUser as jest.Mock).mockRejectedValueOnce(
      new Error('No such user'),
    );

    await expect(
      deactivateUserInteractor({ email: baseCourtEmail }, authorizedUser),
    ).rejects.toThrow(
      `One or more deactivations failed:\nERROR: failed to deactivate (${mockCourtUser.userId}|${mockCourtUser.email}): No such user`,
    );

    expect(deactivateUserMock).toHaveBeenCalledWith({
      userId: mockCourtUser.userId,
    });
  });

  it('should throw an error when persistence deactivateUser rejects', async () => {
    getUsersWithSimilarEmails.mockResolvedValueOnce([{ ...mockCourtUser }]);
    (deactivateUserMock as jest.Mock).mockRejectedValueOnce('db is down');

    await expect(
      deactivateUserInteractor({ email: baseCourtEmail }, authorizedUser),
    ).rejects.toThrow(
      `One or more deactivations failed:\nERROR: failed to deactivate (${mockCourtUser.userId}|${mockCourtUser.email}): db is down`,
    );

    expect(getUserGateway().disableUser).toHaveBeenCalled();
  });

  it('should include an "already disabled" line, then the success line for that user (exact HTML)', async () => {
    const disabledUser = {
      email: 'disabled@ustaxcourt.gov',
      role: ROLES.petitionsClerk,
      status: 'CONFIRMED',
      userId: 'user-disabled',
      enabled: false,
    };

    getUsersWithSimilarEmails.mockResolvedValueOnce([disabledUser]);

    deactivateUser.mockResolvedValueOnce('admissions');

    const result = await deactivateUserInteractor(
      { email: 'disabled@ustaxcourt.gov' },
      authorizedUser,
    );

    expect(getUserGateway().disableUser).toHaveBeenCalledWith({
      email: 'disabled@ustaxcourt.gov',
    });
    expect(deactivateUser).toHaveBeenCalledWith({ userId: 'user-disabled' });

    expect(result).toBe(
      'disabled@ustaxcourt.gov is already disabled<br>' +
        'INFO: removed (user-disabled|disabled@ustaxcourt.gov) from admissions',
    );
  });

  it('should handle a mix of disabled and enabled, return disabled message first, then both success lines', async () => {
    const disabledUser = {
      email: 'enabled+disabled@ustaxcourt.gov',
      role: ROLES.petitionsClerk,
      status: 'CONFIRMED',
      userId: 'user-disabled',
      enabled: false,
    };
    const enabledUser = {
      email: 'enabled@ustaxcourt.gov',
      role: ROLES.petitionsClerk,
      status: 'CONFIRMED',
      userId: 'user-enabled',
      enabled: true,
    };

    getUsersWithSimilarEmails.mockResolvedValueOnce([
      disabledUser,
      enabledUser,
    ]);

    deactivateUser
      .mockResolvedValueOnce('admissions')
      .mockResolvedValueOnce('docket');

    const result = await deactivateUserInteractor(
      { email: 'enabled@ustaxcourt.gov' },
      authorizedUser,
    );

    expect(result).toBe(
      'enabled+disabled@ustaxcourt.gov is already disabled<br>' +
        'INFO: removed (user-disabled|enabled+disabled@ustaxcourt.gov) from admissions<br>' +
        'INFO: removed (user-enabled|enabled@ustaxcourt.gov) from docket',
    );
  });

  it('should still throw an error on failure even if some users are disabled', async () => {
    const disabledUser = {
      email: 'disabled@ustaxcourt.gov',
      role: ROLES.petitionsClerk,
      status: 'CONFIRMED',
      userId: 'user-disabled',
      enabled: false,
    };

    getUsersWithSimilarEmails.mockResolvedValueOnce([disabledUser]);

    (getUserGateway().disableUser as jest.Mock).mockRejectedValueOnce(
      new Error('Cognito down'),
    );

    await expect(
      deactivateUserInteractor(
        { email: 'disabled@ustaxcourt.gov' },
        authorizedUser,
      ),
    ).rejects.toThrow(
      'One or more deactivations failed:\n' +
        'ERROR: failed to deactivate (user-disabled|disabled@ustaxcourt.gov): Cognito down',
    );
  });

  it('should a simple HTML response when there are no disabled users', async () => {
    const enabledUser = {
      email: 'courtuser@ustaxcourt.gov',
      role: ROLES.docketClerk,
      status: 'CONFIRMED',
      userId: 'user-1',
      enabled: true,
    };

    getUsersWithSimilarEmails.mockResolvedValueOnce([enabledUser]);
    (deactivateUser as jest.Mock).mockResolvedValueOnce('docket');

    const result = await deactivateUserInteractor(
      { email: 'courtuser@ustaxcourt.gov' },
      authorizedUser,
    );

    expect(result).toBe(
      'INFO: removed (user-1|courtuser@ustaxcourt.gov) from docket',
    );
  });
});
