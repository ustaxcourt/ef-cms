import { state } from 'cerebral';

export const headerHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const userRole = user && user.role;
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
  const isCaseMessages = currentPage.startsWith('CaseMessages');

  const pageIsHome =
    isDashboard ||
    ([
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.adc,
    ].includes(userRole) &&
      isMessages);
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');
  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsCaseMessages: isCaseMessages && workQueueIsInternal,
    pageIsDashboard:
      isDashboard && applicationContext.getUtilities().isExternalUser(userRole),
    pageIsDocumentQC: isMessages && !workQueueIsInternal,
    pageIsHome,
    pageIsMessages: isMessages && workQueueIsInternal,
    pageIsMyCases:
      isDashboard && applicationContext.getUtilities().isExternalUser(userRole),
    pageIsReports: isCaseDeadlines || isBlockedCasesReport,
    pageIsTrialSessions:
      isTrialSessions &&
      applicationContext.getUtilities().isInternalUser(userRole),
    showAccountMenu: isLoggedIn,
    showDocumentQC: applicationContext.getUtilities().isInternalUser(userRole),
    showHomeIcon: [USER_ROLES.judge, USER_ROLES.chambers].includes(userRole),
    showMessages: applicationContext.getUtilities().isInternalUser(userRole),
    showMessagesIcon: notifications.myInboxUnreadCount > 0,
    showMyCases:
      applicationContext.getUtilities().isExternalUser(userRole) &&
      user &&
      userRole &&
      userRole !== USER_ROLES.irsSuperuser,
    showReports: applicationContext.getUtilities().isInternalUser(userRole),
    showSearchInHeader:
      user &&
      userRole &&
      userRole !== USER_ROLES.petitioner &&
      userRole !== USER_ROLES.privatePractitioner &&
      userRole !== USER_ROLES.irsPractitioner &&
      userRole !== USER_ROLES.irsSuperuser,
    showSearchNavItem: user && userRole && userRole === USER_ROLES.irsSuperuser,
    showTrialSessions: permissions && permissions.TRIAL_SESSIONS,
    userName: user && user.name,
  };
};
