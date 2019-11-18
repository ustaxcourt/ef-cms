import { state } from 'cerebral';

/**
 * sets the current user on state.form.practitioner if that user is a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setPractitionerOnFormAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const user = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.practitioner) {
    store.set(state.form.practitioner, [{ ...user, partyPractitioner: true }]);
  }
};
