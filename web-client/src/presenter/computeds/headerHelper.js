import { state } from 'cerebral';

export const headerHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isLoggedIn = !!user;
  const currentPage = get(state.currentPage) || '';
  const notifications = get(state.notifications);
  const workQueueIsInternal = get(state.workQueueToDisplay.workQueueIsInternal);
  const { USER_ROLES } = applicationContext.getConstants();
  const permissions = get(state.permissions);

  const isOtherUser = role => {
    const externalRoles = [USER_ROLES.petitionsClerk, USER_ROLES.docketClerk];
    return !externalRoles.includes(role);
  };

  const isTrialSessions = currentPage.includes('TrialSession');
  const isDashboard = currentPage.startsWith('Dashboard');
  const isMessages = currentPage.startsWith('Messages');

  const pageIsInterstitial = currentPage == 'Interstitial';
  const pageIsHome =
    isDashboard ||
    ([
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.adc,
    ].includes(user.role) &&
      isMessages);
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');
  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');

  return {
    defaultQCBoxPath: isOtherUser(user.role)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDocumentQC: isMessages && !workQueueIsInternal,
    pageIsHome,
    pageIsInterstitial,
    pageIsMessages: isMessages && workQueueIsInternal,
    pageIsMyCases:
      isDashboard &&
      applicationContext.getUtilities().isExternalUser(user.role),
    pageIsReports: isCaseDeadlines || isBlockedCasesReport,
    pageIsTrialSessions:
      isTrialSessions &&
      applicationContext.getUtilities().isInternalUser(user.role),
    showAccountMenu: isLoggedIn,
    showDocumentQC: applicationContext.getUtilities().isInternalUser(user.role),
    showHomeIcon: user.role === USER_ROLES.judge,
    showMessages: applicationContext.getUtilities().isInternalUser(user.role),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases: applicationContext.getUtilities().isExternalUser(user.role),
    showReports: applicationContext.getUtilities().isInternalUser(user.role),
    showSearchInHeader:
      user &&
      user.role &&
      user.role !== USER_ROLES.practitioner &&
      user.role !== USER_ROLES.respondent,
    showTrialSessions: permissions && permissions.TRIAL_SESSIONS,
  };
};
