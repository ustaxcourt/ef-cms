import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setUserPermissionsAction } from './setUserPermissionsAction';

describe('setUserPermissionsAction', () => {
  const mockUser = { role: ROLES.docketClerk };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('set state.permissions based on the user role', async () => {
    applicationContext.getCurrentUserPermissions.mockReturnValue(
      getUserPermissions(mockUser),
    );

    const result = await runAction(setUserPermissionsAction, {
      modules: {
        presenter,
      },
      state: {
        permissions: {},
        user: mockUser,
      },
    });

    expect(Object.keys(result.state.permissions).length).toBeGreaterThan(0);
  });

  it('does not set state.permissions if permissions can not be computed', async () => {
    applicationContext.getCurrentUserPermissions.mockReturnValue(undefined);

    presenter.providers.applicationContext.getCurrentUserPermissions = () => {
      return undefined;
    };

    const result = await runAction(setUserPermissionsAction, {
      modules: {
        presenter,
      },
      state: {
        permissions: {},
        user: mockUser,
      },
    });

    expect(Object.keys(result.state.permissions).length).toEqual(0);
  });
});
