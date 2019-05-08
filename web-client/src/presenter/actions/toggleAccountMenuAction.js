import { state } from 'cerebral';

/**
 * Opens / closes the account menu
 */
export const toggleAccountMenuAction = ({ store, get }) => {
  const currentValue = get(state.isAccountMenuOpen);
  store.set(state.isAccountMenuOpen, !currentValue);
};
