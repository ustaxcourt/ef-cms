import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getAllUsersByRoleInteractor = (
  applicationContext: ClientApplicationContext,
  roles: string[],
) => {
  return get({
    applicationContext,
    endpoint: '/users-by-role',
    params: { roles },
  });
};
