import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const headerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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

  const isDashboard = currentPage.startsWith('Dashboard');
  const isTrialSessions = currentPage.includes('TrialSession');
  const isWorkQueue = currentPage.startsWith('WorkQueue');
  const pageIsMessages = currentPage.startsWith('Messages');
  const pageIsHome =
    isDashboard ||
    ([
      USER_ROLES.caseServicesSupervisor,
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.adc,
    ].includes(userRole) &&
      pageIsMessages);

  const isCaseServicesSupervisor =
    userRole === USER_ROLES.caseServicesSupervisor;

  return {
    defaultQCBoxPath: isOtherUser(userRole)
      ? '/document-qc/section/inbox'
      : '/document-qc/my/inbox',
    pageIsDashboard: isDashboard && isExternalUser,
    pageIsDocumentQC: isWorkQueue,
    pageIsHome,
    pageIsMessages,
    pageIsMyCases: isDashboard && isExternalUser,
    pageIsTrialSessions: isTrialSessions && isInternalUser,
    showAccountMenu: isLoggedIn,
    showDocumentQC: isInternalUser && !isCaseServicesSupervisor,
    showHomeIcon: [USER_ROLES.judge, USER_ROLES.chambers].includes(userRole),
    showMessages:
      isInternalUser &&
      userRole !== USER_ROLES.general &&
      !isCaseServicesSupervisor,
    showMessagesAndQCDropDown: isCaseServicesSupervisor,
    showMyAccount: [
      USER_ROLES.privatePractitioner,
      USER_ROLES.irsPractitioner,
      USER_ROLES.petitioner,
    ].includes(userRole),
    showMyCases:
      isExternalUser && userRole && userRole !== USER_ROLES.irsSuperuser,
    showReports: isInternalUser,
    showSearchInHeader:
      userRole &&
      ![
        USER_ROLES.petitioner,
        USER_ROLES.privatePractitioner,
        USER_ROLES.irsPractitioner,
        USER_ROLES.irsSuperuser,
      ].includes(userRole),
    showSearchNavItem: userRole && userRole === USER_ROLES.irsSuperuser,
    showTrialSessions: permissions && permissions.TRIAL_SESSIONS,
    showVerifyEmailWarningNotification: !!user?.pendingEmail,
    unreadMessageCount,
    userName: user && user.name,
    ustcSealLink: isLoggedIn ? '/' : applicationContext.getPublicSiteUrl(),
  };
};
