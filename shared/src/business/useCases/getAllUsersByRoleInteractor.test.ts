import '@web-api/persistence/postgres/users/mocks.jest';
import { getAllUsersByRoleInteractor } from '@shared/business/useCases/getAllUsersByRoleInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getUsersByRoles as getUsersByRolesMock } from '@web-api/persistence/postgres/users/getUsersByRoles';
import { docketClerk1User, petitionsClerkUser } from '@shared/test/mockUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { Role } from '@shared/business/entities/EntityConstants';

const getUsersByRoles = jest.mocked(getUsersByRolesMock);

describe('getAllUsersByRoleInteractor', () => {
  const TEST_ROLES: Role[] = ['adc', 'admin'];
  const EXPECTED_RESULTS = [
    docketClerk1User as DbUser,
    petitionsClerkUser as DbUser,
  ];

  beforeEach(() => {
    getUsersByRoles.mockResolvedValue(EXPECTED_RESULTS);
  });

  it('should throw an Unauthorized error when user does not have permission', async () => {
    await expect(
      getAllUsersByRoleInteractor(
        {
          roles: TEST_ROLES,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call the persistance method with corred params', async () => {
    const results = await getAllUsersByRoleInteractor(
      {
        roles: TEST_ROLES,
      },
      mockDocketClerkUser,
    );

    expect(results).toEqual(EXPECTED_RESULTS);

    const { calls } = getUsersByRoles.mock;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual({ roles: TEST_ROLES });
  });
});
