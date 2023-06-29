import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the default service stamp on the form if the user is a petitions clerk
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const setDefaultServiceStampAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  if (user.role === USER_ROLES.petitionsClerk) {
    store.set(state.form.serviceStamp, 'Served');
  }
};
