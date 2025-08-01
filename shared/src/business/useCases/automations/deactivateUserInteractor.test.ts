import { ROLES } from '@shared/business/entities/EntityConstants';
import { deactivateUserInteractor } from '@shared/business/useCases/automations/deactivateUserInteractor';
import { getUserGateway } from '@web-api/getUserGateway';
import { deactivateUser } from '@web-api/persistence/postgres/users/deactivateUser';

jest.mock('@web-api/getUserGateway', () => ({
  getUserGateway: jest.fn(() => ({
    getUserByEmail: jest.fn(),
    disableUser: jest.fn(),
  })),
}));

jest.mock('@web-api/persistence/postgres/users/deactivateUser', () => ({
  deactivateUser: jest.fn(),
}));

describe('deactivateUserInteractor', () => {
  it('should throw UnauthorizedError if user is not authorized', async () => {
    const unauthorizedUser = {
      role: ROLES.docketClerk,
      userId: 'unauthorized-user-id',
      email: 'unauthorized@example.com',
      name: 'Unauthorized User',
    };

    await expect(
      deactivateUserInteractor(
        { email: 'testUser@example.com' },
        unauthorizedUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });
  it('should throw NotFoundError if user does not exist', async () => {
    const authorizedUser = {
      role: ROLES.zendesk,
      userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
      email: 'zendesk@example.com',
      name: 'Zendesk User',
    };

    await expect(
      deactivateUserInteractor(
        { email: 'zendesk@example.com' },
        authorizedUser,
      ),
    ).rejects.toThrow('Could not find user with email');
  });
  it('should call disableUser and deactivateUser with correct parameters', async () => {
    const authorizedUser = {
      role: ROLES.zendesk,
      userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
      email: 'zendesk@example.com',
      name: 'Zendesk User',
    };

    getUserGateway.mockReturnValue({
      getUserByEmail: () => ({
        userId: 'dabbad03-18d0-43ec-bafb-654e83405416',
      }),
      disableUser: jest.fn(),
    });

    await deactivateUserInteractor(
      { email: 'zendesk@example.com' },
      authorizedUser,
    );

    expect(getUserGateway().disableUser).toHaveBeenCalled();
    expect(deactivateUser).toHaveBeenCalled();
  });
});
