import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import {
  getDocumentQCInboxCountsForSection,
  getDocumentQCInboxCountsForUser,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxCounts';
import { getSectionInboxMessages } from '@web-api/persistence/postgres/messages/getSectionInboxMessages';
import { getUserInboxMessages } from '@web-api/persistence/postgres/messages/getUserInboxMessages';
import { getQCInboxParameters } from '../utilities/getQCInboxParameters';

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

  const qcInboxParameters = getQCInboxParameters({
    judgeId,
    user: authorizedUser,
    section,
    selectedSection,
  });

  applicationContext.logger.info(
    'getNotificationsInteractor about to start queries',
    {
      sectionToDisplay: qcInboxParameters.section,
    },
  );

  const [userInbox, sectionInbox, userQCCounts, sectionQCCounts] =
    await Promise.all([
      getUserInboxMessages({
        applicationContext,
        userId: authorizedUser.userId,
      }),
      getSectionInboxMessages({
        applicationContext,
        section: selectedSection || section,
      }),
      getDocumentQCInboxCountsForUser({
        userId: authorizedUser.userId,
        role: authorizedUser.role,
        section: qcInboxParameters.section,
      }),
      getDocumentQCInboxCountsForSection({
        ...qcInboxParameters,
        role: authorizedUser.role,
      }),
    ]);

  const unreadMessageCount = userInbox.filter(
    message => !message.isRead,
  ).length;

  applicationContext.logger.info('getNotificationsInteractor done filtering', {
    qcIndividualInProgressCount: userQCCounts.inProgressCount,
    qcIndividualInboxCount: userQCCounts.inboxCount,
    qcSectionInProgressCount: sectionQCCounts.inProgressCount,
    qcSectionInboxCount: sectionQCCounts.inboxCount,
    unreadMessageCount,
  });

  return {
    qcIndividualInProgressCount: userQCCounts.inProgressCount,
    qcIndividualInboxCount: userQCCounts.inboxCount,
    qcSectionInProgressCount: sectionQCCounts.inProgressCount,
    qcSectionInboxCount: sectionQCCounts.inboxCount,
    qcUnreadCount: userQCCounts.unreadCount,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
