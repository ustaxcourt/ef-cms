import { CHIEF_JUDGE, ROLES } from '../entities/EntityConstants';
import { IServerApplicationContext } from '@web-api/applicationContext';
import { isEmpty } from 'lodash';

const getJudgeUser = async (
  judgeUserId: string,
  applicationContext: IApplicationContext,
  role: string,
) => {
  let judgeUser;

  if (judgeUserId) {
    judgeUser = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: judgeUserId });
  } else if (role === ROLES.adc) {
    judgeUser = {
      name: CHIEF_JUDGE,
    };
  }

  return judgeUser;
};

export const getNotificationsInteractor = async (
  applicationContext: IServerApplicationContext,
  {
    caseServicesSupervisorData,
    judgeUserId,
  }: { judgeUserId: string; caseServicesSupervisorData: any },
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

  const [currentUser, judgeUser] = await Promise.all([
    applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: appContextUser.userId }),
    getJudgeUser(judgeUserId, applicationContext, appContextUser.role),
  ]);

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

  const [
    userInbox,
    sectionInbox,
    documentQCIndividualInbox,
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
    applicationContext.getPersistenceGateway().getDocumentQCInboxForUser({
      applicationContext,
      userId,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCInboxForSection({
      applicationContext,
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToDisplay,
    }),
  ]);

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
