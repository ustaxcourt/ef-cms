import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);

  const isUserInternal = user => {
    const internalRoles = ['petitionsclerk', 'docketclerk', 'seniorattorney'];
    if (user && user.role && internalRoles.includes(user.role)) {
      return true;
    } else {
      return false;
    }
  };
  const isUserExternal = user => {
    const externalRoles = ['petitioner', 'practitioner', 'respondent'];
    if (user && user.role && externalRoles.includes(user.role)) {
      return true;
    } else {
      return false;
    }
  };

  return {
    showDocumentQC: isUserInternal(user),
    showMessages: isUserInternal(user),
    showMyCases: isUserExternal(user),
    showSearchInHeader: user && user.role && user.role !== 'practitioner',
  };
};
