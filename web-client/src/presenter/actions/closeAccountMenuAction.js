import { state } from 'cerebral';

/**
 * Closes the account menu
 */
export const closeAccountMenuAction = ({ store }) => {
  store.set(state.isAccountMenuOpen, false);
};
