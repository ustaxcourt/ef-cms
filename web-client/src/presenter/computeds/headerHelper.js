import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);
  const currentPage = get(state.currentPage);
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueIsInternal);

  const isUserInternal = user => {
    const internalRoles = ['petitionsclerk', 'docketclerk', 'seniorattorney'];
    return user && user.role && internalRoles.includes(user.role);
  };
  const isUserExternal = user => {
    const externalRoles = ['petitioner', 'practitioner', 'respondent'];
    return user && user.role && externalRoles.includes(user.role);
  };
  const isOtherUser = user => {
    const externalRoles = ['petitionsclerk', 'docketclerk'];
    return user && user.role && !externalRoles.includes(user.role);
  };

  return {
    defaultQCBoxPath: isOtherUser(user)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC:
      currentPage &&
      currentPage.includes('Dashboard') &&
      !workQueueIsInternal &&
      (!currentPage || !currentPage.includes('TrialSessions')),
    pageIsMessages:
      currentPage &&
      currentPage.includes('Dashboard') &&
      workQueueIsInternal &&
      (!currentPage || !currentPage.includes('TrialSessions')),
    pageIsMyCases:
      currentPage && currentPage.includes('Dashboard') && isUserExternal(user),
    pageIsTrialSessions:
      currentPage &&
      currentPage.includes('TrialSessions') &&
      isUserInternal(user),
    showDocumentQC: isUserInternal(user),
    showMessages: isUserInternal(user),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases: isUserExternal(user),
    showSearchInHeader: user && user.role && user.role !== 'practitioner',
    showTrialSessions: isUserInternal(user),
  };
};
