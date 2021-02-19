import { state } from 'cerebral';

export const menuHelper = get => {
  const isAccountMenuOpen = get(state.navigation.openMenu) === 'AccountMenu';
  const isReportsMenuOpen = get(state.navigation.openMenu) === 'ReportsMenu';
  const isEditCaseTrialInformationMenuOpen =
    get(state.navigation.editCaseTrialInfoMenu) ===
    'EditCaseTrialInformationMenu';
  const isCaseDetailMenuOpen =
    get(state.navigation.caseDetailMenu) === 'CaseDetailMenu';

  return {
    isAccountMenuOpen,
    isCaseDetailMenuOpen,
    isEditCaseTrialInformationMenuOpen,
    isReportsMenuOpen,
  };
};
