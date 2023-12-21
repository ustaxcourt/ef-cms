import { applicationContext } from '../test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getAllUsersByRoleInteractor } from '@shared/business/useCases/getAllUsersByRoleInteractor';

describe('getAllUsersByRoleInteractor', () => {
  const TEST_ROLES = ['SOME', 'ROLES'];
  const EXPECTED_RESULTS = ['user1', 'user2'];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getAllUsersByRole.mockReturnValue(EXPECTED_RESULTS);
  });

  it('should throw an Unauthorized error when user does not have permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      getAllUsersByRoleInteractor(applicationContext, {
        roles: TEST_ROLES,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call the persistance method with corred params', async () => {
    const results = await getAllUsersByRoleInteractor(applicationContext, {
      roles: TEST_ROLES,
    });

    expect(results).toEqual(EXPECTED_RESULTS);

    const { calls } =
      applicationContext.getPersistenceGateway().getAllUsersByRole.mock;
    expect(calls.length).toEqual(1);
    expect(calls[0][1]).toEqual(TEST_ROLES);
  });
});
