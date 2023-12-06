import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const menuHelper = (get: Get): any => {
  const isAccountMenuOpen = get(state.navigation.openMenu) === 'AccountMenu';
  const isReportsMenuOpen = get(state.navigation.openMenu) === 'ReportsMenu';
  const isMessagesMenuOpen = get(state.navigation.openMenu) === 'MessagesMenu';
  const isDocumentQCMenuOpen =
    get(state.navigation.openMenu) === 'DocumentQCMenu';
  const isCaseDetailMenuOpen =
    get(state.navigation.caseDetailMenu) === 'CaseDetailMenu';

  return {
    isAccountMenuOpen,
    isCaseDetailMenuOpen,
    isDocumentQCMenuOpen,
    isMessagesMenuOpen,
    isReportsMenuOpen,
  };
};
