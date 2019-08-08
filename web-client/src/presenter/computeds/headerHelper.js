import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);
  const currentPage = get(state.currentPage) || '';
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueIsInternal);

  const isUserInternal = user => {
    const internalRoles = [
      'docketclerk',
      'judge',
      'petitionsclerk',
      'seniorattorney',
    ];
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

  const isTrialSessions = currentPage.startsWith('TrialSessions');
  const isTrialSessionDetails = currentPage.startsWith('TrialSessionDetail');
  const isDashboard = currentPage.startsWith('Dashboard');

  return {
    defaultQCBoxPath: isOtherUser(user)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC: isDashboard && !workQueueIsInternal && !isTrialSessions,
    pageIsMessages: isDashboard && workQueueIsInternal && !isTrialSessions,
    pageIsMyCases: isDashboard && isUserExternal(user),
    pageIsTrialSessions:
      currentPage &&
      (isTrialSessions || isTrialSessionDetails) &&
      isUserInternal(user),
    showDocumentQC: isUserInternal(user),
    showMessages: isUserInternal(user),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases: isUserExternal(user),
    showSearchInHeader:
      user &&
      user.role &&
      user.role !== 'practitioner' &&
      user.role !== 'respondent',
    showTrialSessions: isUserInternal(user),
  };
};
