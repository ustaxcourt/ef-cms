import { state } from 'cerebral';

export const reportsMenuHelper = get => {
  const isMenuOpen = get(state.isReportsMenuOpen) || false;
  return { isMenuOpen };
};
