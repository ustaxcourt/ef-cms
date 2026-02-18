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
      section: selectedSection || section,
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

  const qcIndividualInProgressCount = countUniqueWorkItems(
    documentQCIndividualInbox.filter(filters['my']['inProgress']),
  );

  const qcIndividualInboxCount = countUniqueWorkItems(
    documentQCIndividualInbox.filter(filters['my']['inbox']),
  );

  const qcSectionInProgressCount = countUniqueWorkItems(
    (documentQCSectionInbox || []).filter(filters['section']['inProgress']),
  );

  const qcSectionInboxCount = countUniqueWorkItems(
    (documentQCSectionInbox || []).filter(filters['section']['inbox']),
  );

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
    qcSectionInProgressCount,
    qcSectionInboxCount,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};

const countUniqueWorkItems = workItems => {
  const seenWorkItems = new Set();

  for (const workItem of workItems) {
    seenWorkItems.add(workItem.docketEntryId);
  }

  return seenWorkItems.size;
};
