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
import { getWorkQueueFilters } from '@shared/business/utilities/getWorkQueueFilters';
import { getQCInboxParameters } from '../utilities/getQCInboxParameters';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const getJudgeUser = async ({
  judgeUserId,
  role,
}: {
  judgeUserId: string | undefined;
  role: string;
}) => {
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
    judgeId,
    section,
    selectedSection,
  }: {
    judgeId?: string;
    section: string;
    selectedSection?: string;
  },
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
    getJudgeUser({ judgeUserId: judgeId, role: authorizedUser.role }),
  ]);

  applicationContext.logger.info('getNotificationsInteractor getUser', {
    currentUser,
    judgeUser,
  });

  const qcInboxParameters = getQCInboxParameters({
    judgeId,
    user: authorizedUser,
    section,
    selectedSection,
  });

  const filters = getWorkQueueFilters({
    section: qcInboxParameters.section,
    user: { ...authorizedUser, section: qcInboxParameters.section },
  });

  applicationContext.logger.info(
    'getNotificationsInteractor about to start queries',
    {
      sectionToDisplay: qcInboxParameters.section,
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
      userId: authorizedUser.userId,
    }),
    getSectionInboxMessages({
      applicationContext,
      section: qcInboxParameters.section,
    }),
    getDocumentQCInboxForUser({
      userId: authorizedUser.userId,
    }),
    getDocumentQCInboxForSection(qcInboxParameters),
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
