import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);
  const isLoggedIn = !!user;
  const userRole = get(state.user.role);
  const currentPage = get(state.currentPage) || '';
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueToDisplay.workQueueIsInternal);

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

  const isTrialSessions = currentPage.includes('TrialSession');
  const isDashboard = currentPage.startsWith('Dashboard');
  const pageIsMessages = currentPage.startsWith('Messages');
  const pageIsInterstitial = currentPage == 'Interstitial';
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC: isDashboard && !workQueueIsInternal && !isTrialSessions,
    pageIsHome: isDashboard && !pageIsMessages,
    pageIsInterstitial,
    pageIsMessages,
    pageIsMyCases: isDashboard && isUserExternal(userRole),
    pageIsReports: isCaseDeadlines,
    pageIsTrialSessions: isTrialSessions && isUserInternal(userRole),
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
