import { CHIEF_JUDGE, ROLES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getDocumentQCInboxForSection } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection';
import { getDocumentQCInboxForUser } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { getSectionInboxMessages } from '@web-api/persistence/postgres/messages/getSectionInboxMessages';
import { getUserInboxMessages } from '@web-api/persistence/postgres/messages/getUserInboxMessages';
import { isEmpty } from 'lodash';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const getJudgeUser = async (judgeUserId: string, role: string) => {
  let judgeUser;

  if (judgeUserId) {
    judgeUser = await getUserById({ userId: judgeUserId });
  } else if (role === ROLES.adc) {
    judgeUser = {
      name: CHIEF_JUDGE,
    };
  }

  return judgeUser;
};

export const getNotificationsInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseServicesSupervisorData,
    judgeUserId,
  }: { judgeUserId: string; caseServicesSupervisorData: any },
  authorizedUser: UnknownAuthUser,
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
  applicationContext.logger.info('getNotificationsInteractor start', {
    appContextUser: authorizedUser,
  });

  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError('Invalid User getting notifications');
  }

  const [currentUser, judgeUser] = await Promise.all([
    getUserById({ userId: authorizedUser.userId }),
    getJudgeUser(judgeUserId, authorizedUser.role),
  ]);

  applicationContext.logger.info('getNotificationsInteractor getUser', {
    currentUser,
    judgeUser,
  });

  const { section, userId } = caseServicesSupervisorData || currentUser;

  let sectionToDisplay = applicationContext
    .getUtilities()
    .getDocQcSectionForUser(currentUser);

  if (!isEmpty(caseServicesSupervisorData)) {
    sectionToDisplay = caseServicesSupervisorData.section;
  }

  const filters = applicationContext
    .getUtilities()
    .getWorkQueueFilters({ section: sectionToDisplay, user: currentUser });

  applicationContext.logger.info(
    'getNotificationsInteractor about to start queries',
    {
      sectionToDisplay,
    },
  );

  const [
    userInbox,
    sectionInbox,
    documentQCIndividualInbox,
    documentQCSectionInbox,
  ] = await Promise.all([
    getUserInboxMessages({
      applicationContext,
      userId,
    }),
    getSectionInboxMessages({
      applicationContext,
      section,
    }),
    getDocumentQCInboxForUser({
      userId,
    }),
    getDocumentQCInboxForSection({
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToDisplay,
    }),
  ]);

  applicationContext.logger.info(
    'getNotificationsInteractor queries complete',
    {
      documentQCIndividualInbox: documentQCIndividualInbox.length,
      documentQCSectionInbox: documentQCSectionInbox?.length,
      sectionInbox: sectionInbox.length,
      userInbox: userInbox.length,
    },
  );

  const qcIndividualInProgressCount = documentQCIndividualInbox.filter(
    filters['my']['inProgress'],
  ).length;
  const qcIndividualInboxCount = documentQCIndividualInbox.filter(
    filters['my']['inbox'],
  ).length;

  const qcSectionInProgressCount = documentQCSectionInbox?.filter(
    filters['section']['inProgress'],
  ).length;
  const qcSectionInboxCount = documentQCSectionInbox?.filter(
    filters['section']['inbox'],
  ).length;

  const unreadMessageCount = userInbox.filter(
    message => !message.isRead,
  ).length;

  applicationContext.logger.info('getNotificationsInteractor done filtering', {
    qcIndividualInProgressCount,
    qcIndividualInboxCount,
    qcSectionInProgressCount,
    qcSectionInboxCount,
    unreadMessageCount,
  });

  return {
    qcIndividualInProgressCount,
    qcIndividualInboxCount,
    qcSectionInProgressCount: qcSectionInProgressCount || 0,
    qcSectionInboxCount: qcSectionInboxCount || 0,
    qcUnreadCount: documentQCIndividualInbox.filter(item => !item.isRead)
      .length,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
