import { CHIEF_JUDGE, ROLES } from '../entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
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
  applicationContext: ServerApplicationContext,
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
      box: 'inbox',
      userId,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForUser({
      applicationContext,
      box: 'inProgress',
      userId,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForSection({
      applicationContext,
      box: 'inbox',
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToDisplay,
    }),
    applicationContext.getPersistenceGateway().getDocumentQCForSection({
      applicationContext,
      box: 'inbox',
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToDisplay,
    }),
  ]);

  const qcIndividualInProgressCount = documentQcIndividualInProgress.length;
  const qcIndividualInboxCount = documentQCIndividualInbox.length;

  const qcSectionInProgressCount = documentQcSectionInProgress.length;
  const qcSectionInboxCount = documentQCSectionInbox.length;

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
