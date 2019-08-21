import { state } from 'cerebral';

export const menuHelper = get => {
  const isAccountMenuOpen = get(state.isAccountMenuOpen) || false;
  const isReportsMenuOpen = get(state.isReportsMenuOpen) || false;
  return { isAccountMenuOpen, isReportsMenuOpen };
};
