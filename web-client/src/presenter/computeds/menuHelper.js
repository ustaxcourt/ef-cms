import { state } from 'cerebral';

export const menuHelper = get => {
  const isAccountMenuOpen = get(state.navigation.openMenu) === 'AccountMenu';
  const isReportsMenuOpen = get(state.navigation.openMenu) === 'ReportsMenu';
  const isTrialSessionInformationMenuOpen =
    get(state.navigation.editTrialSessionMenu) === 'TrialSessionInformationMenu';
  const isCaseDetailMenuOpen =
    get(state.navigation.caseDetailMenu) === 'CaseDetailMenu';
  return {
    isAccountMenuOpen,
    isCaseDetailMenuOpen,
    isReportsMenuOpen,
    isTrialSessionInformationMenuOpen,
  };
};
