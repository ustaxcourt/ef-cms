const { CHIEF_JUDGE, ROLES } = require('../entities/EntityConstants');

/**
 * getNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.judgeUser optional judgeUser for additional filtering
 * @returns {object} inbox unread message counts for the individual and section inboxes
 */
exports.getNotificationsInteractor = async (
  applicationContext,
  { judgeUserId },
) => {
  const appContextUser = applicationContext.getCurrentUser();
  const currentUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: appContextUser.userId });

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

  const { section, userId } = currentUser;
  const sectionToShow = applicationContext
    .getUtilities()
    .getDocQcSectionForUser(currentUser);

  const userInbox = await applicationContext
    .getPersistenceGateway()
    .getUserInboxMessages({ applicationContext, userId });

  const sectionInbox = await applicationContext
    .getPersistenceGateway()
    .getSectionInboxMessages({ applicationContext, section });

  const documentQCIndividualInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId,
    });

  const documentQCIndividualInProgress = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInProgressForUser({
      applicationContext,
      userId,
    });

  const documentQCSectionInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToShow,
    });

  const documentQCSectionInProgress = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInProgressForSection({
      applicationContext,
      judgeUserName: judgeUser ? judgeUser.name : null,
      section: sectionToShow,
    });

  const unreadMessageCount = userInbox.filter(
    message => !message.isRead,
  ).length;

  return {
    qcIndividualInProgressCount: documentQCIndividualInProgress.length,
    qcIndividualInboxCount: documentQCIndividualInbox.length,
    qcSectionInProgressCount: documentQCSectionInProgress.length,
    qcSectionInboxCount: documentQCSectionInbox.length,
    qcUnreadCount: documentQCIndividualInbox.filter(item => !item.isRead)
      .length,
    unreadMessageCount,
    userInboxCount: userInbox.length,
    userSectionCount: sectionInbox.length,
  };
};
