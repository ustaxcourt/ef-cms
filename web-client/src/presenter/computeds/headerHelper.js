import { state } from 'cerebral';

export const headerHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const userRole = user && user.role;
  const isLoggedIn = !!user;
  const currentPage = get(state.currentPage) || '';
  const { USER_ROLES } = applicationContext.getConstants();
  const permissions = get(state.permissions);
  const unreadMessageCount = get(state.notifications.unreadMessageCount);
  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(userRole);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(userRole);

  const isOtherUser = role => {
    const externalRoles = [USER_ROLES.petitionsClerk, USER_ROLES.docketClerk];
    return !externalRoles.includes(role);
  };

  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');
  const isDashboard = currentPage.startsWith('Dashboard');
  const isTrialSessions = currentPage.includes('TrialSession');
  const isWorkQueue = currentPage.startsWith('WorkQueue');
  const pageIsMessages = currentPage.startsWith('Messages');
  const pageIsHome =
    isDashboard ||
    ([
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.adc,
    ].includes(userRole) &&
      pageIsMessages);

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDashboard: isDashboard && isExternalUser,
    pageIsDocumentQC: isWorkQueue,
    pageIsHome,
    pageIsMessages,
    pageIsMyCases: isDashboard && isExternalUser,
    pageIsReports: isCaseDeadlines || isBlockedCasesReport,
    pageIsTrialSessions: isTrialSessions && isInternalUser,
    showAccountMenu: isLoggedIn,
    showDocumentQC: isInternalUser,
    showHomeIcon: [USER_ROLES.judge, USER_ROLES.chambers].includes(userRole),
    showMessages: isInternalUser && userRole !== USER_ROLES.general,
    showMyAccount:
      userRole === USER_ROLES.privatePractitioner ||
      userRole === USER_ROLES.irsPractitioner,
    showMyCases:
      isExternalUser && userRole && userRole !== USER_ROLES.irsSuperuser,
    showReports: isInternalUser,
    showSearchInHeader:
      userRole &&
      userRole !== USER_ROLES.petitioner &&
      userRole !== USER_ROLES.privatePractitioner &&
      userRole !== USER_ROLES.irsPractitioner &&
      userRole !== USER_ROLES.irsSuperuser,
    showSearchNavItem: userRole && userRole === USER_ROLES.irsSuperuser,
    showTrialSessions: permissions && permissions.TRIAL_SESSIONS,
    unreadMessageCount,
    userName: user && user.name,
  };
};
