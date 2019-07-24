import { state } from 'cerebral';

export const accountMenuHelper = get => {
  const isMenuOpen = get(state.isAccountMenuOpen) || false;
  return { isMenuOpen };
};
