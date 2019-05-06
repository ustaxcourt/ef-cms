import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);

  const isUserInternal = user => {
    const internalRoles = ['petitionsclerk', 'docketclerk'];
    if (user && user.role && internalRoles.indexOf(user.role) > -1) {
      return true;
    } else {
      return false;
    }
  };
  const isUserExternal = user => {
    const externalRoles = ['petitioner', 'practitioner'];
    if (user && user.role && externalRoles.indexOf(user.role) > -1) {
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
