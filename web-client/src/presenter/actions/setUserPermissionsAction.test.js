import { User } from '../../../../shared/src/business/entities/User';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';

import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setUserPermissionsAction } from './setUserPermissionsAction';

const mockUser = { role: User.ROLES.docketClerk };

presenter.providers.applicationContext = {
  getCurrentUserPermissions: () => {
    return getUserPermissions(mockUser);
  },
};

describe('setUserPermissionsAction', () => {
  it('set state.permissions based on the user role', async () => {
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
