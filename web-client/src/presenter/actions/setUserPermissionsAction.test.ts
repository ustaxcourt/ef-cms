import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
});
