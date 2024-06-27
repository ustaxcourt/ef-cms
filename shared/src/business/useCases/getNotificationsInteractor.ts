import {
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getNotificationsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseServicesSupervisorData,
    judgeUserId,
  }: {
    judgeUserId?: string;
    caseServicesSupervisorData?: { section: string; userId: string };
  },
): Promise<{
  qcIndividualInProgressCount: number;
  qcIndividualInboxCount: number;
  qcSectionInProgressCount: number;
  qcSectionInboxCount: number;
  qcUnreadCount: number;
  unreadMessageCount: number;
  userInboxCount: number;
  userSectionCount: number;
}> => {
  const appContextUser = applicationContext.getCurrentUser();

  if (!isAuthorized(appContextUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for getting work items');
  }

  const currentUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: appContextUser.userId });

  const { role } = currentUser;
  const { section, userId } = caseServicesSupervisorData || currentUser;

  let judgeUserName;
  if (role === 'adc' || judgeUserId === CHIEF_JUDGE) {
    judgeUserName = CHIEF_JUDGE;
    judgeUserId = undefined;
  }

  let documentQcSection =
    section === PETITIONS_SECTION ? PETITIONS_SECTION : DOCKET_SECTION;

  const [
    userInbox,
    sectionInbox,
    documentQcIndividualInProgress,
    documentQCIndividualInbox,
    documentQcSectionInProgress,
    documentQCSectionInbox,
  ] = await Promise.all([
    applicationContext.getPersistenceGateway().getUserInboxMessages({
      applicationContext,
      userId,
    }),
    applicationContext.getPersistenceGateway().getSectionInboxMessages({
      applicationContext,
      section,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForUser({
      applicationContext,
      box: 'inProgress',
      userId,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForUser({
      applicationContext,
      box: 'inbox',
      userId,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForSection({
      applicationContext,
      box: 'inProgress',
      judgeUserId,
      judgeUserName,
      section: documentQcSection,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForSection({
      applicationContext,
      box: 'inbox',
      judgeUserId,
      judgeUserName,
      section: documentQcSection,
    }),
  ]);

  const qcIndividualInProgressCount = documentQcIndividualInProgress.length;
  const qcIndividualInboxCount = documentQCIndividualInbox.length;

  const qcSectionInProgressCount = documentQcSectionInProgress.length;
  const qcSectionInboxCount = documentQCSectionInbox.length;

  const unreadMessageCount = userInbox.filter(
    message => !message.isRead,
  ).length;

  const qcUnreadCount = documentQCIndividualInbox.filter(
    item => !item.isRead,
  ).length;

  return {
    qcIndividualInProgressCount,
    qcIndividualInboxCount,
    qcSectionInProgressCount,
    qcSectionInboxCount,
    qcUnreadCount,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
