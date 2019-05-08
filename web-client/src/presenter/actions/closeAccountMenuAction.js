import { state } from 'cerebral';

/**
 * Closes the account menu
 */
export const closeAccountMenuAction = ({ store, get }) => {
  store.set(state.isAccountMenuOpen, false);
};
