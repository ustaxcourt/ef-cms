import '@web-api/persistence/postgres/users/mocks.jest';
import { getAllUsersByRoleInteractor } from '@shared/business/useCases/getAllUsersByRoleInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getAllUsersByRole as getAllUsersByRoleMock } from '@web-api/persistence/postgres/users/getAllUsersByRole';

const getAllUsersByRole = getAllUsersByRoleMock as jest.Mock;

describe('getAllUsersByRoleInteractor', () => {
  const TEST_ROLES = ['SOME', 'ROLES'];
  const EXPECTED_RESULTS = ['user1', 'user2'];

  beforeEach(() => {
    getAllUsersByRole.mockReturnValue(EXPECTED_RESULTS);
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

    const { calls } = getAllUsersByRole.mock;
    expect(calls.length).toEqual(1);
    expect(calls[0][0].roles).toEqual(TEST_ROLES);
  });
});
