import { state } from 'cerebral';

/**
 * Closes the account menu
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting isAccountMenuOpen
 */
export const closeAccountMenuAction = ({ store }) => {
  store.set(state.isAccountMenuOpen, false);
};
