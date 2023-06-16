import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the user permissions based on their role
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store object
 */
export const setUserPermissionsAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const userPermissions = applicationContext.getCurrentUserPermissions();
  store.set(state.permissions, userPermissions);
};
