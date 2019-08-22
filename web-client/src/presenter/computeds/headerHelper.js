import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);
  const isLoggedIn = !!user;
  const userRole = get(state.user.role);
  const currentPage = get(state.currentPage) || '';
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueIsInternal);

  const isUserInternal = role => {
    const internalRoles = [
      'docketclerk',
      'judge',
      'petitionsclerk',
      'seniorattorney',
    ];
    return internalRoles.includes(role);
  };
  const isUserExternal = role => {
    const externalRoles = ['petitioner', 'practitioner', 'respondent'];
    return externalRoles.includes(role);
  };
  const isOtherUser = role => {
    const externalRoles = ['petitionsclerk', 'docketclerk'];
    return !externalRoles.includes(role);
  };

  const isTrialSessions = currentPage.startsWith('TrialSessions');
  const isTrialSessionDetails = currentPage.startsWith('TrialSessionDetail');
  const isDashboard = currentPage.startsWith('Dashboard');
  const pageIsMessages =
    userRole == 'judge'
      ? currentPage.startsWith('Messages')
      : isDashboard && workQueueIsInternal && !isTrialSessions;

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC: isDashboard && !workQueueIsInternal && !isTrialSessions,
    pageIsHome: isDashboard && !pageIsMessages,
    pageIsMessages,
    pageIsMyCases: isDashboard && isUserExternal(userRole),
    pageIsTrialSessions:
      currentPage &&
      (isTrialSessions || isTrialSessionDetails) &&
      isUserInternal(userRole),
    showAccountMenu: isLoggedIn,
    showDocumentQC: isUserInternal(userRole),
    showHomeIcon: userRole == 'judge',
    showMessages: isUserInternal(userRole),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases: isUserExternal(userRole),
    showReports: isUserInternal(userRole),
    showSearchInHeader:
      user &&
      userRole &&
      userRole !== 'practitioner' &&
      userRole !== 'respondent',
    showTrialSessions: isUserInternal(userRole),
  };
};
