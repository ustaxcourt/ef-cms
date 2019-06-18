import { state } from 'cerebral';

/**
 * Set default party on form based on user role.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultPartySelectionAction = ({ get, store }) => {
  const userRole = get(state.user.role);

  if (userRole === 'petitioner') {
    store.set(state.form.partyPrimary, true);
  }
};
