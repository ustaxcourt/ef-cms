import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);
  const currentPage = get(state.currentPage);
  const notifications = get(state.notifications);

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
    pageIsDocumentQC: false, // doesn't exist yet
    pageIsMessages:
      currentPage && currentPage.includes('Dashboard') && isUserInternal(user),
    pageIsMyCases:
      currentPage && currentPage.includes('Dashboard') && isUserExternal(user),
    showDocumentQC: isUserInternal(user),
    showMessages: isUserInternal(user),
    showMessagesIcon: notifications.unreadCount > 0,
    showMyCases: isUserExternal(user),
    showSearchInHeader: user && user.role && user.role !== 'practitioner',
  };
};
