import { get } from '../requests';

export const getAllUsersByRoleInteractor = (
  applicationContext,
  roles: string[],
) => {
  return get({
    applicationContext,
    endpoint: '/users-by-role',
    params: { roles },
  });
};
