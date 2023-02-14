import { CHIEF_JUDGE, ROLES } from '../entities/EntityConstants';
import { isEmpty } from 'lodash';

const getJudgeUser = async (
  judgeUserId: string,
  applicationContext: IApplicationContext,
  currentUser: any,
) => {
  let judgeUser = null;

  if (judgeUserId) {
    judgeUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: judgeUserId });
  } else if (currentUser.role === ROLES.adc) {
    judgeUser = {
      name: CHIEF_JUDGE,
    };
  }
  return judgeUser;
};

/**
 * getNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseServicesSupervisorData optional caseServicesSupervisorData containing section
 * @param {object} providers.judgeUser optional judgeUser for additional filtering
 * @returns {object} inbox unread message counts for the individual and section inboxes
 */
export const getNotificationsInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseServicesSupervisorData,
    judgeUserId,
  }: { judgeUserId: string; caseServicesSupervisorData: any },
) => {
  const appContextUser = applicationContext.getCurrentUser();

  const currentUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: appContextUser.userId });

  const judgeUser = await getJudgeUser(
    judgeUserId,
    applicationContext,
    currentUser,
  );

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

  const userInbox = await applicationContext
    .getPersistenceGateway()
    .getUserInboxMessages({
      applicationContext,
      userId,
    });

  const sectionInbox = await applicationContext
    .getPersistenceGateway()
    .getSectionInboxMessages({
      applicationContext,
      section,
    });

  const documentQCIndividualInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

  const documentQCSectionInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToDisplay,
    });

  const qcIndividualInProgressCount = documentQCIndividualInbox.filter(
    filters['my']['inProgress'],
  ).length;
  const qcIndividualInboxCount = documentQCIndividualInbox.filter(
    filters['my']['inbox'],
  ).length;

  const qcSectionInProgressCount = documentQCSectionInbox.filter(
    filters['section']['inProgress'],
  ).length;
  const qcSectionInboxCount = documentQCSectionInbox.filter(
    filters['section']['inbox'],
  ).length;

  const unreadMessageCount = userInbox.filter(
    message => !message.isRead,
  ).length;

  return {
    qcIndividualInProgressCount,
    qcIndividualInboxCount,
    qcSectionInProgressCount,
    qcSectionInboxCount,
    qcUnreadCount: documentQCIndividualInbox.filter(item => !item.isRead)
      .length,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
