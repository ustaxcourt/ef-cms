import { getUserPermissions } from '@shared/authorization/getUserPermissions';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the user permissions based on their role
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store object
 */
export const setUserPermissionsAction = ({ get, store }: ActionProps) => {
  const user = get(state.user);
  const userPermissions = getUserPermissions(user);
  console.debug('userPermissions:', userPermissions);
  store.set(state.permissions, userPermissions);
};
