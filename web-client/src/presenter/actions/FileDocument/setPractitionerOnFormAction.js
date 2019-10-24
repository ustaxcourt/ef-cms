import { state } from 'cerebral';

/**
 * sets the current user on state.form.practitioner if that user is a practitioner
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setPractitionerOnFormAction = async ({ get, store }) => {
  const user = get(state.user);
  const USER_ROLES = get(state.constants.USER_ROLES);

  if (user.role === USER_ROLES.practitioner) {
    store.set(state.form.practitioner, [{ ...user, partyPractitioner: true }]);
  }
};
