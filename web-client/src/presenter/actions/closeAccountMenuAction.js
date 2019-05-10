import { state } from 'cerebral';

/**
 * Closes the account menu
 *
 * @param {Object} providers.store the cerebral store object
 */
export const closeAccountMenuAction = ({ store }) => {
  store.set(state.isAccountMenuOpen, false);
};
